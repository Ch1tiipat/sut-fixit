import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HISTORY_TASKS = [
  { id: '1', room: 'หอพัก 1 ・ ห้อง B-402', issue: 'ท่อน้ำรั่วในห้องน้ำ', finishedDate: '24 ต.ค. 2568', earned: 'เสร็จสิ้น' },
  { id: '2', room: 'หอพัก 4 ・ ห้อง 101', issue: 'เปลี่ยนลูกบิดประตู', finishedDate: '20 ต.ค. 2568', earned: 'เสร็จสิ้น' },
];

const MONTH_OPTIONS = ['สิงหาคม 2568', 'กันยายน 2568', 'ตุลาคม 2568', 'พฤศจิกายน 2568'];

export default function TechHistoryScreen() {
  const [selectedMonth, setSelectedMonth] = useState('ตุลาคม 2568');
  const [modalVisible, setModalVisible] = useState(false);

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
        <Text style={styles.pageTitle}>ประวัติการทำงาน</Text>
      </View>

      <TouchableOpacity style={styles.monthFilter} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
        <Text style={styles.monthFilterText}>เดือน {selectedMonth}</Text>
        <Ionicons name="calendar" size={18} color="#6B7280" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {HISTORY_TASKS.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.historyCard}
            activeOpacity={0.7}
            onPress={() => router.push('/(technician)/history-detail' as any)} 
          >
            <View style={styles.cardLeft}>
              <View style={styles.successIconBox}>
                <Ionicons name="checkmark-done" size={20} color="#10B981" />
              </View>
              <View>
                <Text style={styles.historyTitle} numberOfLines={1}>{task.issue}</Text>
                <Text style={styles.historySubtitle}>{task.room}</Text>
                <Text style={styles.historyDate}>ซ่อมเสร็จเมื่อ: {task.finishedDate}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{task.earned}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เลือกเดือนที่ต้องการดูประวัติ</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={MONTH_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedMonth(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedMonth === item && { color: '#F28C28', fontWeight: '700' }]}>{item}</Text>
                  {selectedMonth === item && <Ionicons name="checkmark-circle" size={20} color="#F28C28" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  monthFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  monthFilterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#4B5563',
  },
});