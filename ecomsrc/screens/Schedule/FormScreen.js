import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARYAPPCOLOR, WHITECOLOR } from '../../utils/Colour/Color';

const FormScreen = () => {
  const navigation = useNavigation();

  // Form State
  const [lessonRange, setLessonRange] = useState('10');
  const [weekCount, setWeekCount] = useState('2');
  const [workingDays, setWorkingDays] = useState('5');
  const [prefix, setPrefix] = useState('abc');
  const [hours, setHours] = useState('1');

  // Error States
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // 1. Validate Lesson start & Lesson End
    if (!lessonRange.trim()) {
      tempErrors.lessonRange = 'Lesson start & Lesson End is required';
      isValid = false;
    } else {
      const rangePattern = /^(\d+)-(\d+)$/;
      const singleNumPattern = /^(\d+)$/;
      if (rangePattern.test(lessonRange.trim())) {
        const [, start, end] = lessonRange.trim().match(rangePattern);
        if (parseInt(start, 10) > parseInt(end, 10)) {
          tempErrors.lessonRange = 'Start lesson cannot be greater than End lesson';
          isValid = false;
        } else if (parseInt(start, 10) <= 0 || parseInt(end, 10) <= 0) {
          tempErrors.lessonRange = 'Lesson numbers must be greater than 0';
          isValid = false;
        }
      } else if (singleNumPattern.test(lessonRange.trim())) {
        if (parseInt(lessonRange.trim(), 10) <= 0) {
          tempErrors.lessonRange = 'Number of lessons must be greater than 0';
          isValid = false;
        }
      } else {
        tempErrors.lessonRange = 'Enter a valid count (e.g. 10) or range (e.g. 1-10)';
        isValid = false;
      }
    }

    // 2. Validate Week Count
    if (!weekCount.trim()) {
      tempErrors.weekCount = 'Week Count is required';
      isValid = false;
    } else {
      const val = parseInt(weekCount.trim(), 10);
      if (isNaN(val) || val <= 0) {
        tempErrors.weekCount = 'Week Count must be a positive integer';
        isValid = false;
      }
    }

    // 3. Validate Working days in week
    if (!workingDays.trim()) {
      tempErrors.workingDays = 'Working days in week is required';
      isValid = false;
    } else {
      const val = parseInt(workingDays.trim(), 10);
      if (isNaN(val) || val <= 0 || val > 7) {
        tempErrors.workingDays = 'Working days must be between 1 and 7';
        isValid = false;
      }
    }

    // 4. Validate Prefix
    if (!prefix.trim()) {
      tempErrors.prefix = 'Prefix is required';
      isValid = false;
    }

    // 5. Validate Hours
    if (!hours.trim()) {
      tempErrors.hours = 'Hours per day is required';
      isValid = false;
    } else {
      const val = parseInt(hours.trim(), 10);
      if (isNaN(val) || val <= 0 || val > 24) {
        tempErrors.hours = 'Hours must be between 1 and 24';
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Parse lessons start and end
      let startLesson = 1;
      let endLesson = 10;
      
      const trimmedRange = lessonRange.trim();
      const rangePattern = /^(\d+)-(\d+)$/;
      if (rangePattern.test(trimmedRange)) {
        const [, start, end] = trimmedRange.match(rangePattern);
        startLesson = parseInt(start, 10);
        endLesson = parseInt(end, 10);
      } else {
        startLesson = 1;
        endLesson = parseInt(trimmedRange, 10);
      }

      const formData = {
        startLesson,
        endLesson,
        totalLessons: endLesson - startLesson + 1,
        weekCount: parseInt(weekCount.trim(), 10),
        workingDays: parseInt(workingDays.trim(), 10),
        prefix: prefix.trim(),
        hours: parseInt(hours.trim(), 10),
      };

      navigation.navigate('ScheduleScreen', { formData });
    } else {
      Alert.alert('Validation Error', 'Please check the errors in the form.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={PRIMARYAPPCOLOR} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="calendar-outline" size={28} color={WHITECOLOR} />
        </View>
        <Text style={styles.headerTitle}>Work Schedule Creator</Text>
        <Text style={styles.headerSubtitle}>Set up your custom weekly timetable</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formCard}>
          {/* Prefix Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prefix</Text>
            <View style={[styles.inputContainer, errors.prefix && styles.inputErrorBorder]}>
              <Ionicons name="text-outline" size={20} color={PRIMARYAPPCOLOR} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={prefix}
                onChangeText={setPrefix}
                placeholder="e.g. abc"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>
            {errors.prefix && <Text style={styles.errorText}>{errors.prefix}</Text>}
          </View>

          {/* Lesson Start & End Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lesson start & Lesson End</Text>
            <View style={[styles.inputContainer, errors.lessonRange && styles.inputErrorBorder]}>
              <Ionicons name="book-outline" size={20} color={PRIMARYAPPCOLOR} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={lessonRange}
                onChangeText={setLessonRange}
                placeholder="e.g. 10 or 1-10"
                placeholderTextColor="#999"
                keyboardType="default"
              />
            </View>
            <Text style={styles.helperText}>Enter total lessons (e.g. 10) or range (e.g. 1-10)</Text>
            {errors.lessonRange && <Text style={styles.errorText}>{errors.lessonRange}</Text>}
          </View>

          {/* Week Count Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Week Count</Text>
            <View style={[styles.inputContainer, errors.weekCount && styles.inputErrorBorder]}>
              <Ionicons name="grid-outline" size={20} color={PRIMARYAPPCOLOR} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={weekCount}
                onChangeText={setWeekCount}
                placeholder="e.g. 2"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
            {errors.weekCount && <Text style={styles.errorText}>{errors.weekCount}</Text>}
          </View>

          {/* Working Days Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Working days in week</Text>
            <View style={[styles.inputContainer, errors.workingDays && styles.inputErrorBorder]}>
              <Ionicons name="calendar-clear-outline" size={20} color={PRIMARYAPPCOLOR} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={workingDays}
                onChangeText={setWorkingDays}
                placeholder="e.g. 5"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
            {errors.workingDays && <Text style={styles.errorText}>{errors.workingDays}</Text>}
          </View>

          {/* Hours Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hours per day</Text>
            <View style={[styles.inputContainer, errors.hours && styles.inputErrorBorder]}>
              <Ionicons name="time-outline" size={20} color={PRIMARYAPPCOLOR} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={hours}
                onChangeText={setHours}
                placeholder="e.g. 1"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
            {errors.hours && <Text style={styles.errorText}>{errors.hours}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Generate Work Schedule</Text>
            <Ionicons name="arrow-forward-outline" size={20} color={WHITECOLOR} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: PRIMARYAPPCOLOR,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WHITECOLOR,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: WHITECOLOR,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 50,
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
  },
  helperText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: PRIMARYAPPCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#2AC16C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITECOLOR,
  },
});

export default FormScreen;
