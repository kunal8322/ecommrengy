import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARYAPPCOLOR, WHITECOLOR, SECOUNDARYAPPCOLOR } from '../../utils/Colour/Color';

const { width } = Dimensions.get('window');

const ScheduleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { formData } = route.params;

  const {
    startLesson,
    endLesson,
    totalLessons,
    weekCount,
    workingDays,
    prefix,
    hours,
  } = formData;

  const totalDays = workingDays * weekCount;

  // Track the active day tab index
  const [activeDay, setActiveDay] = useState(0);

  // Persistence of editable text inputs per day index and hour slot index
  // Key format: `${dayIndex}-${hourIndex}` -> string value
  const [inputsData, setInputsData] = useState({});

  const tabScrollViewRef = useRef(null);

  // Auto-scroll active tab into view when activeDay changes
  useEffect(() => {
    if (tabScrollViewRef.current) {
      const tabWidth = 90; // Approx tab width
      const scrollPosition = activeDay * tabWidth - (width / 2) + (tabWidth / 2);
      tabScrollViewRef.current.scrollTo({
        x: Math.max(0, scrollPosition),
        animated: true,
      });
    }
  }, [activeDay]);

  // Math logic: Evenly distribute lessons across days
  // E.g., Case 1: Lessons > Days (Lessons = 20, Days = 10 -> 2 lessons per day)
  // E.g., Case 2: Lessons < Days (Lessons = 5, Days = 10 -> 1 lesson per day for first 5 days, blank for rest)
  const getLessonsForDay = (dayIndex) => {
    const lessonsPerDay = Math.ceil(totalLessons / totalDays);
    const dayStart = startLesson + dayIndex * lessonsPerDay;
    
    if (dayStart > endLesson) {
      return ''; // No lessons left for this day
    }

    const dayEnd = Math.min(dayStart + lessonsPerDay - 1, endLesson);
    
    // Construct lesson strings
    let lessonList = [];
    for (let i = dayStart; i <= dayEnd; i++) {
      lessonList.push(`${prefix} Lesson ${i}`);
    }

    return lessonList.join(' , ');
  };

  // Generate pretty non-editable time strings (e.g. 09:00 AM - 10:00 AM)
  const getTimeString = (index) => {
    const startHour = 9 + index;
    const formatHour = (h) => {
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
    };
    return `${formatHour(startHour)} - ${formatHour(startHour + 1)}`;
  };

  const handleInputChange = (hourIndex, text) => {
    const key = `${activeDay}-${hourIndex}`;
    setInputsData((prev) => ({
      ...prev,
      [key]: text,
    }));
  };

  const getInputValue = (hourIndex) => {
    const key = `${activeDay}-${hourIndex}`;
    return inputsData[key] || '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARYAPPCOLOR} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color={WHITECOLOR} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Custom Work Schedule</Text>
          <Text style={styles.headerSubtitle}>
            {weekCount} {weekCount === 1 ? 'Week' : 'Weeks'} • {workingDays} Days/Week • {totalLessons} Lessons
          </Text>
        </View>
      </View>

      {/* Dynamic Scrollable Tabs (Day 1, Day 2, Day 3...) */}
      <View style={styles.tabContainer}>
        <ScrollView
          ref={tabScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {Array.from({ length: totalDays }).map((_, index) => {
            const isActive = index === activeDay;
            const weekNumber = Math.floor(index / workingDays) + 1;
            const dayOfWeek = (index % workingDays) + 1;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabItem,
                  isActive && styles.activeTabItem,
                ]}
                onPress={() => setActiveDay(index)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabWeekText, isActive && styles.activeTabWeekText]}>
                  W{weekNumber}
                </Text>
                <Text style={[styles.tabDayText, isActive && styles.activeTabDayText]}>
                  Day {index + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Schedule Content Card */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Info Card representing Lesson Distribution for active Day */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="journal-outline" size={24} color={PRIMARYAPPCOLOR} />
            <Text style={styles.infoLabel}>Assigned Lessons</Text>
          </View>
          <View style={styles.lessonsContainer}>
            {getLessonsForDay(activeDay) ? (
              <Text style={styles.lessonsText}>{getLessonsForDay(activeDay)}</Text>
            ) : (
              <Text style={styles.noLessonsText}>No lessons assigned for this day</Text>
            )}
          </View>
        </View>

        {/* Header Title for Time Slots */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Time Slots</Text>
          <Text style={styles.sectionSubtitle}>Fill in your daily hour notes</Text>
        </View>

        {/* Time Slots Form inputs list */}
        {Array.from({ length: hours }).map((_, index) => (
          <View key={index} style={styles.slotCard}>
            {/* Hour index & Time indicator */}
            <View style={styles.slotHeader}>
              <View style={styles.hourBadge}>
                <Text style={styles.hourBadgeText}>Hour {index + 1}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.timeText}>{getTimeString(index)}</Text>
              </View>
            </View>

            {/* Editable note input slot */}
            <TextInput
              style={styles.slotInput}
              value={getInputValue(index)}
              onChangeText={(text) => handleInputChange(index, text)}
              placeholder={`Enter notes or topic for hour ${index + 1}...`}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: PRIMARYAPPCOLOR,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITECOLOR,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  tabContainer: {
    backgroundColor: WHITECOLOR,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    paddingVertical: 10,
  },
  tabsScrollContent: {
    paddingHorizontal: 12,
  },
  tabItem: {
    width: 80,
    height: 60,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTabItem: {
    backgroundColor: SECOUNDARYAPPCOLOR,
    borderColor: PRIMARYAPPCOLOR,
  },
  tabWeekText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabWeekText: {
    color: PRIMARYAPPCOLOR,
    fontWeight: 'bold',
  },
  tabDayText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4B5563',
    marginTop: 2,
  },
  activeTabDayText: {
    color: PRIMARYAPPCOLOR,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: WHITECOLOR,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  lessonsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARYAPPCOLOR,
  },
  lessonsText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    lineHeight: 22,
  },
  noLessonsText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  sectionHeader: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  slotCard: {
    backgroundColor: WHITECOLOR,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 12,
  },
  hourBadge: {
    backgroundColor: SECOUNDARYAPPCOLOR,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hourBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARYAPPCOLOR,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  timeText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    marginLeft: 4,
  },
  slotInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    color: '#1F2937',
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 60,
  },
});

export default ScheduleScreen;
