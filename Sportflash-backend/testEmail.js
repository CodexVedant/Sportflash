require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');

const testEmail = async () => {
    console.log('🧪 Testing Email Configuration...');
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   Port: ${process.env.SMTP_PORT}`);
    console.log(`   User: ${process.env.SMTP_EMAIL}`);

    try {
        await sendEmail({
            email: 'test-recipient@example.com', // Replace with your email to see it in inbox
            subject: 'Test Email from SportFlash',
            message: 'If you are reading this, your SMTP configuration is working correctly!'
        });
        console.log('✅ Test email process completed.');
    } catch (error) {
        console.error('❌ Test email failed.');
        console.error(error);
    }
    process.exit();
};

testEmail();
