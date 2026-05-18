import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARYAPPCOLOR, WHITECOLOR, GREYCOLOR } from '../../utils/Colour/Color';

const { width } = Dimensions.get('window');

const ScheduleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { formData } = route.params || {};

  if (!formData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No schedule data found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { startLesson, endLesson, totalLessons, weekCount, workingDays, prefix, hours } = formData;
  const totalDays = workingDays * weekCount;

  // Active day index state (0 to totalDays - 1)
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Persistence of editable text inputs per day and hour
  // Key format: `${dayIndex}-${hourIndex}`
  const [inputsData, setInputsData] = useState({});

  // 1. Lessons logic
  const lessonsPerDay = Math.ceil(totalLessons / totalDays);

  const getLessonsForDay = (dayIndex) => {
    const lessonsList = [];
    const startIndex = dayIndex * lessonsPerDay;
    for (let i = 0; i < lessonsPerDay; i++) {
      const currentLessonNum = startLesson + startIndex + i;
      if (currentLessonNum <= endLesson) {
        lessonsList.push(currentLessonNum);
      }
    }
    return lessonsList;
  };

  // Generate day tab objects
  const dayTabs = Array.from({ length: totalDays }, (_, i) => {
    const weekNum = Math.floor(i / workingDays) + 1;
    const dayOfWeek = (i % workingDays) + 1;
    return {
      index: i,
      label: `Day ${i + 1}`,
      weekNum,
      dayOfWeek,
    };
  });

  // Generate time slot string
  const formatTimeSlot = (hourIndex) => {
    const startHour = 9 + hourIndex;
    const endHour = startHour + 1;
    const formatTime = (h) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
    };
    return `${formatTime(startHour)} - ${formatTime(endHour)}`;
  };

  // Handle text input changes
  const handleInputChange = (dayIndex, hourIndex, text) => {
    setInputsData((prev) => ({
      ...prev,
      [`${dayIndex}-${hourIndex}`]: text,
    }));
  };

  // Render a day tab button in the horizontal scroll list
  const renderDayTab = ({ item }) => {
    const isActive = activeDayIndex === item.index;
    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          isActive && styles.activeTabButton,
        ]}
        onPress={() => setActiveDayIndex(item.index)}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
          {item.label}
        </Text>
        <Text style={[styles.tabSubLabel, isActive && styles.activeTabSubLabel]}>
          W{item.weekNum}•D{item.dayOfWeek}
        </Text>
      </TouchableOpacity>
    );
  };

  const activeDayLessons = getLessonsForDay(activeDayIndex);
  const activeDayInfo = dayTabs[activeDayIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARYAPPCOLOR} />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={WHITECOLOR} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{prefix.toUpperCase()} Schedule</Text>
          <Text style={styles.headerSubtitle}>
            {weekCount} Weeks • {workingDays} Days/Wk ({totalDays} Days Total)
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Horizontal Scrollable Day Tabs List */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={dayTabs}
          renderItem={renderDayTab}
          keyExtractor={(item) => item.index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Day Summary Card */}
        <View style={styles.dayCard}>
          <View style={styles.dayCardHeader}>
            <View>
              <Text style={styles.dayCardTitle}>Week {activeDayInfo.weekNum}</Text>
              <Text style={styles.dayCardSubtitle}>Working Day {activeDayInfo.dayOfWeek}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeDayInfo.label}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Lessons Subsection */}
          <Text style={styles.sectionLabel}>Today's Lessons</Text>
          {activeDayLessons.length > 0 ? (
            <View style={styles.lessonsRow}>
              {activeDayLessons.map((lessonNum) => (
                <View key={lessonNum} style={styles.lessonBadge}>
                  <Ionicons name="bookmark" size={14} color={PRIMARYAPPCOLOR} style={{ marginRight: 6 }} />
                  <Text style={styles.lessonBadgeText}>
                    {prefix} Lesson {lessonNum}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyLessonsContainer}>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <Text style={styles.emptyLessonsText}>No lessons scheduled for today</Text>
            </View>
          )}
        </View>

        {/* Schedule Time Slots / Hours Section */}
        <Text style={styles.mainSectionTitle}>Hourly Work Schedule</Text>
        <Text style={styles.mainSectionSubtitle}>Fill in your plans for each hour slot</Text>

        {Array.from({ length: hours }).map((_, hourIndex) => {
          const timeSlotLabel = formatTimeSlot(hourIndex);
          const valKey = `${activeDayIndex}-${hourIndex}`;
          const currentVal = inputsData[valKey] || '';

          return (
            <View key={hourIndex} style={styles.hourSlotCard}>
              <View style={styles.hourHeader}>
                <Ionicons name="time" size={18} color={PRIMARYAPPCOLOR} style={{ marginRight: 6 }} />
                <Text style={styles.hourTimeLabel}>{timeSlotLabel}</Text>
              </View>
              <TextInput
                style={styles.hourInput}
                value={currentVal}
                onChangeText={(text) => handleInputChange(activeDayIndex, hourIndex, text)}
                placeholder="Enter plan / notes for this hour..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: PRIMARYAPPCOLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backBtnText: {
    color: WHITECOLOR,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: PRIMARYAPPCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: WHITECOLOR,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: WHITECOLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  tabsScrollContent: {
    paddingHorizontal: 15,
  },
  tabButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  activeTabButton: {
    backgroundColor: PRIMARYAPPCOLOR,
    borderColor: PRIMARYAPPCOLOR,
    elevation: 2,
    shadowColor: PRIMARYAPPCOLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  activeTabLabel: {
    color: WHITECOLOR,
  },
  tabSubLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  activeTabSubLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  dayCard: {
    backgroundColor: WHITECOLOR,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dayCardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#E8F8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: PRIMARYAPPCOLOR,
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 10,
  },
  lessonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  lessonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    margin: 4,
  },
  lessonBadgeText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  emptyLessonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingVertical: 16,
  },
  emptyLessonsText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 8,
    fontWeight: '500',
  },
  mainSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
  },
  mainSectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 15,
  },
  hourSlotCard: {
    backgroundColor: WHITECOLOR,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hourHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hourTimeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  hourInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 60,
  },
});

export default ScheduleScreen;
