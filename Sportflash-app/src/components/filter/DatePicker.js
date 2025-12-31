import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/DatePicker.styles';

// Conditional import - only load DateTimePicker on native platforms
let DateTimePicker = null;
if (Platform.OS !== 'web') {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function DatePicker({ dateRange, onDateChange }) {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const formatDate = (date) => {
        if (!date) return 'Select Date';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            onDateChange({ ...dateRange, start: selectedDate });
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            onDateChange({ ...dateRange, end: selectedDate });
        }
    };

    // Web-specific date input handler
    const handleWebDateInput = (type, value) => {
        if (Platform.OS === 'web' && value) {
            const newDate = new Date(value);
            onDateChange({
                ...dateRange,
                [type]: newDate
            });
        }
    };

    const clearDates = () => {
        onDateChange({ start: null, end: null });
    };

    const setQuickDate = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onDateChange({ start, end });
    };

    return (
        <View style={styles.container}>
            {/* Quick Date Buttons */}
            <View style={styles.quickButtons}>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickDate(7)}
                >
                    <Text style={styles.quickButtonText}>Last 7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickDate(30)}
                >
                    <Text style={styles.quickButtonText}>Last 30 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickDate(90)}
                >
                    <Text style={styles.quickButtonText}>Last 90 Days</Text>
                </TouchableOpacity>
            </View>

            {/* Date Range Selectors */}
            <View style={styles.dateRow}>
                {/* Start Date */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>From</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleWebDateInput('start', e.target.value)}
                            max={dateRange.end ? dateRange.end.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '10px',
                                color: theme.colors.text,
                                fontSize: '14px',
                                fontFamily: theme.fonts.body,
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={18} color={theme.colors.textMuted} />
                            <Text style={styles.dateText}>{formatDate(dateRange.start)}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Separator */}
                <View style={styles.separator}>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
                </View>

                {/* End Date */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>To</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleWebDateInput('end', e.target.value)}
                            min={dateRange.start ? dateRange.start.toISOString().split('T')[0] : undefined}
                            max={new Date().toISOString().split('T')[0]}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '10px',
                                color: theme.colors.text,
                                fontSize: '14px',
                                fontFamily: theme.fonts.body,
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={18} color={theme.colors.textMuted} />
                            <Text style={styles.dateText}>{formatDate(dateRange.end)}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Clear Button */}
            {(dateRange.start || dateRange.end) && (
                <TouchableOpacity style={styles.clearButton} onPress={clearDates}>
                    <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                    <Text style={styles.clearText}>Clear Dates</Text>
                </TouchableOpacity>
            )}

            {/* Date Pickers - Native Only */}
            {Platform.OS !== 'web' && DateTimePicker && (
                <>
                    {showStartPicker && (
                        <DateTimePicker
                            value={dateRange.start || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleStartDateChange}
                            maximumDate={dateRange.end || new Date()}
                            themeVariant="dark"
                        />
                    )}

                    {showEndPicker && (
                        <DateTimePicker
                            value={dateRange.end || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleEndDateChange}
                            minimumDate={dateRange.start || undefined}
                            maximumDate={new Date()}
                            themeVariant="dark"
                        />
                    )}
                </>
            )}
        </View>
    );
}
