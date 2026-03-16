import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ACTIVE_TASKS = [
  {
    id: '1',
    room: 'หอพัก 1 ・ ห้อง B-402',
    issue: 'แอร์ไม่เย็น (ล้างแอร์)',
    acceptedAt: 'วันนี้, 10:30 น.',
    category: 'ไฟฟ้า',
    status: 'กำลังดำเนินการ',
  },
  {
    id: '2',
    room: 'หอพัก 2 ・ ห้อง A-105',
    issue: 'เปลี่ยนหลอดไฟทางเดิน',
    acceptedAt: 'วันนี้, 13:15 น.',
    category: 'ทั่วไป',
    status: 'กำลังดำเนินการ',
  },
];

export default function TechTasksScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ช่างเทคนิค (Technician)</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn} 
          activeOpacity={0.7} 
          onPress={() => router.push('/(technician)/notification' as any)}
        >
          <Ionicons name="notifications-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>งานที่ต้องทำวันนี้</Text>
        <Text style={styles.pageSubtitle}>คุณมี {ACTIVE_TASKS.length} งานที่กำลังดำเนินการ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ACTIVE_TASKS.map((task) => (
          <View key={task.id} style={styles.activeCard}>
            <View style={styles.cardHeader}>
              <View style={styles.taskTypeBadge}>
                <Ionicons name="build" size={14} color="#FFFFFF" />
                <Text style={styles.taskTypeText}>{task.category}</Text>
              </View>
              <Text style={styles.timeText}>รับงานเมื่อ {task.acceptedAt}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.taskTitle}>{task.issue}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="#F28C28" />
                <Text style={styles.locationText}>{task.room}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.updateBtn} 
                activeOpacity={0.8}
                onPress={() => router.push('/(technician)/task-detail')}
              >
                <Text style={styles.updateBtnText}>อัปเดตสถานะ / ปิดงาน</Text>
                <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F28C28',
    marginTop: 2,
  },
  notificationBtn: {
    padding: 8,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  taskTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F28C28',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});