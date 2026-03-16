import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ==========================================
// Mockup Data: ข้อมูลการแจ้งเตือน 
// ==========================================
const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'success',
    title: 'ซ่อมแซมเสร็จสมบูรณ์ 🎉',
    message: 'รายการ "ล้างแผ่นกรองแอร์" ดำเนินการเสร็จสิ้นแล้ว กรุณาตรวจสอบและให้คะแนนช่าง',
    time: '10 นาทีที่แล้ว',
    isRead: false, 
  },
  {
    id: '2',
    type: 'progress',
    title: 'ช่างกำลังเดินทางไปที่ห้องของคุณ',
    message: 'รายการ "ไฟเพดานกระพริบ" ช่างสมชายกำลังเดินทางไปที่ หอพัก 1 ห้อง 102',
    time: '1 ชม. ที่แล้ว',
    isRead: false,
  },
  {
    id: '3',
    type: 'assigned',
    title: 'ช่างรับงานของคุณแล้ว',
    message: 'รายการ "ก๊อกน้ำรั่ว" ได้รับการตอบรับจากช่างแล้ว คาดว่าจะเข้าซ่อมภายในวันนี้',
    time: '3 ชม. ที่แล้ว',
    isRead: true, 
  },
  {
    id: '4',
    type: 'system',
    title: 'ประกาศจากส่วนซ่อมบำรุง',
    message: 'วันศุกร์นี้จะมีการงดจ่ายน้ำชั่วคราว ตั้งแต่เวลา 09:00 - 12:00 น. ขออภัยในความไม่สะดวก',
    time: '1 วันที่แล้ว',
    isRead: true,
  },
];

// ==========================================
// Main Screen: NotificationScreen
// ==========================================
export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [sortOption, setSortOption] = useState('ใหม่ล่าสุด');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const SORT_OPTIONS = ['ใหม่ล่าสุด', 'เก่าที่สุด', 'ยังไม่ได้อ่าน'];

  // ฟังก์ชันกดอ่านทั้งหมด
  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updated);
  };

  // ฟังก์ชันกดเข้าไปดูรายละเอียดแจ้งเตือน
  const handlePressNotification = (id: string) => {
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updated);
    router.push('/service-completed');
  };

  // ฟังก์ชันเลือก Icon และสีตามประเภทการแจ้งเตือน
  const getIconConfig = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5', lib: 'ion' };
      case 'progress':
        return { icon: 'bicycle', color: '#3B82F6', bg: '#DBEAFE', lib: 'ion' };
      case 'assigned':
        return { icon: 'hammer-wrench', color: '#F59E0B', bg: '#FEF3C7', lib: 'material' };
      case 'system':
        return { icon: 'megaphone', color: '#8B5CF6', bg: '#EDE9FE', lib: 'ion' };
      default:
        return { icon: 'notifications', color: '#6B7280', bg: '#F3F4F6', lib: 'ion' };
    }
  };

  const renderItem = ({ item }: { item: typeof INITIAL_NOTIFICATIONS[0] }) => {
    const config = getIconConfig(item.type);

    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.isRead && styles.unreadItem]} 
        activeOpacity={0.7}
        onPress={() => handlePressNotification(item.id)}
      >
        <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
          {config.lib === 'material' ? (
            <MaterialCommunityIcons name={config.icon as any} size={24} color={config.color} />
          ) : (
            <Ionicons name={config.icon as any} size={24} color={config.color} />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, !item.isRead && styles.unreadText]}>
            {item.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header แบบเดียวกับหน้า Home / History */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
         <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ระบบซ่อมบำรุงหอพัก</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={markAllAsRead} activeOpacity={0.7}>
          <Ionicons name="checkmark-done-outline" size={20} color="#F28C28" />
          <Text style={styles.markReadText}>อ่านทั้งหมด</Text>
        </TouchableOpacity>
      </View>

      {/* Page Title & Sort Controls */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>การแจ้งเตือน</Text>
        
        {/* Sort Dropdown Button */}
        <TouchableOpacity style={styles.sortButton} activeOpacity={0.7} onPress={() => setSortModalVisible(true)}>
          <Ionicons name="filter" size={14} color="#6B7280" />
          <Text style={styles.sortButtonText}>เรียงตาม: {sortOption}</Text>
          <Ionicons name="chevron-down" size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* ========================================== */}
      {/* Modal Dropdown สำหรับเรียงลำดับ (Sort) */}
      {/* ========================================== */}
      <Modal visible={sortModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เรียงลำดับการแจ้งเตือน</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SORT_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSortOption(item);
                    setSortModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, sortOption === item && { color: '#F28C28', fontWeight: '700' }]}>
                    {item}
                  </Text>
                  {sortOption === item && <Ionicons name="checkmark-circle" size={20} color="#F28C28" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
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
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 14,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F28C28',
    marginTop: 2,
  },
  readAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E4D8',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F28C28',
    marginLeft: 4,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  unreadItem: {
    backgroundColor: '#FFF8F1', 
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '800',
    color: '#111827',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F28C28',
    alignSelf: 'center',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 86, 
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
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: { fontSize: 16, color: '#4B5563' },
});