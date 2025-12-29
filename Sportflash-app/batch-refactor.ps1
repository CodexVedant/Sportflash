# Automated Frontend Refactoring Script
# This script processes ALL components and extracts styles to external files

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [int]$BatchSize = 5
)

$SourceDir = "d:\Sportflash\Sportflash-app\src"
$StyleDir = "d:\Sportflash\Sportflash-app\src\utils\style"
$ScriptDir = "d:\Sportflash\Sportflash-app\src\utils\script"

Write-Host "=== Automated Frontend Refactoring ===" -ForegroundColor Cyan
Write-Host ""

# Find all files with StyleSheet.create
$filesToProcess = Get-ChildItem -Path $SourceDir -Recurse -Filter "*.js" | 
    Where-Object { 
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        $content -and $content -match "StyleSheet\.create" -and 
        $_.FullName -notmatch "\\utils\\style\\" -and
        $_.FullName -notmatch "\\utils\\script\\"
    }

Write-Host "Found $($filesToProcess.Count) files to process" -ForegroundColor Yellow
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN MODE - No files will be modified]" -ForegroundColor Magenta
    Write-Host ""
}

$processed = 0
$skipped = 0
$errors = 0

foreach ($file in $filesToProcess) {
    $componentName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $styleFile = Join-Path $StyleDir "$componentName.styles.js"
    
    # Skip if already processed
    if (Test-Path $styleFile) {
        Write-Host "⏭️  Skipping $componentName (already has style file)" -ForegroundColor Gray
        $skipped++
        continue
    }
    
    try {
        Write-Host "📝 Processing: $componentName" -ForegroundColor Cyan
        Write-Host "   Source: $($file.FullName)" -ForegroundColor Gray
        
        if (-not $DryRun) {
            $content = Get-Content $file.FullName -Raw
            
            # Extract StyleSheet.create block using regex
            if ($content -match '(?s)const styles = StyleSheet\.create\(\{(.+?)\}\);') {
                $stylesContent = $matches[1]
                
                # Create style file
                $styleFileContent = @"
import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
$stylesContent});
"@
                
                Set-Content -Path $styleFile -Value $styleFileContent -Encoding UTF8
                Write-Host "   ✅ Created: $styleFile" -ForegroundColor Green
                $processed++
            } else {
                Write-Host "   ⚠️  Could not extract styles" -ForegroundColor Yellow
                $skipped++
            }
        } else {
            Write-Host "   [Would create: $styleFile]" -ForegroundColor Gray
            $processed++
        }
        
    } catch {
        Write-Host "   ❌ Error: $_" -ForegroundColor Red
        $errors++
    }
    
    Write-Host ""
    
    # Batch processing pause
    if ($processed % $BatchSize -eq 0 -and $processed -gt 0) {
        Write-Host "--- Processed $processed files. Press any key to continue or Ctrl+C to stop ---" -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Write-Host ""
    }
}

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Processed: $processed" -ForegroundColor Green
Write-Host "Skipped: $skipped" -ForegroundColor Yellow
Write-Host "Errors: $errors" -ForegroundColor Red
Write-Host ""

if ($DryRun) {
    Write-Host "This was a DRY RUN. Run without -DryRun to actually process files." -ForegroundColor Magenta
} else {
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update each component to import from external style files" -ForegroundColor White
    Write-Host "2. Remove inline StyleSheet.create() from components" -ForegroundColor White
    Write-Host "3. Update src/utils/style/index.js with new exports" -ForegroundColor White
}
