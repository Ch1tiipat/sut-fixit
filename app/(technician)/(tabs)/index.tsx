import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

// ==========================================
// Mock Data (ลบความเร่งด่วนออกแล้ว)
// ==========================================
const TASKS = [
  {
    id: '1',
    room: 'หอพัก 1 ・ ห้อง B-402',
    issue: 'ท่อน้ำรั่วในห้องน้ำ',
    time: '10 นาทีที่แล้ว',
    category: 'ประปา',
  },
  {
    id: '2',
    room: 'หอพัก 2 ・ ห้อง A-105',
    issue: 'แอร์ไม่เย็น มีน้ำหยด',
    time: '1 ชม.ที่แล้ว',
    category: 'เครื่องใช้ไฟฟ้า',
  },
  {
    id: '3',
    room: 'หอพัก 4 ・ ห้อง C-301',
    issue: 'ขาเตียงหัก',
    time: '2 ชม.ที่แล้ว',
    category: 'เฟอร์นิเจอร์',
  },
  {
    id: '4',
    room: 'หอพัก 1 ・ ห้อง B-102',
    issue: 'หลอดไฟทางเดินเสีย',
    time: '3 ชม.ที่แล้ว',
    category: 'ไฟฟ้า',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: 'apps-outline', lib: 'ionic' },
  { id: 'plumbing', label: 'ประปา', icon: 'water-outline', lib: 'ionic' },
  { id: 'electrical', label: 'ไฟฟ้า', icon: 'flash-outline', lib: 'ionic' },
  { id: 'furniture', label: 'เฟอร์นิเจอร์', icon: 'bed-outline', lib: 'ionic' },
  { id: 'appliances', label: 'เครื่องใช้ไฟฟ้า', icon: 'tv-outline', lib: 'ionic' },
  { id: 'other', label: 'อื่นๆ', icon: 'ellipsis-horizontal', lib: 'ionic' },
];

// เอาตัวเลือกเรียงตามความเร่งด่วนออก
const SORT_OPTIONS = ['ใหม่ล่าสุด', 'เก่าที่สุด'];

// ==========================================
// Main Screen: TechDashboardScreen
// ==========================================
export default function TechDashboardScreen() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [sortOption, setSortOption] = useState('ใหม่ล่าสุด');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'ประปา': return { icon: 'water', color: '#0EA5E9', bg: '#E0F2FE' };
      case 'ไฟฟ้า': return { icon: 'flash', color: '#EAB308', bg: '#FEF9C3' };
      case 'เฟอร์นิเจอร์': return { icon: 'bed', color: '#8B5CF6', bg: '#EDE9FE' };
      case 'เครื่องใช้ไฟฟ้า': return { icon: 'tv', color: '#EC4899', bg: '#FCE7F3' };
      default: return { icon: 'build', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const goToDetail = () => {
    router.push('/(technician)/job-request-detail' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ช่างเทคนิค (Technician)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7} onPress={() => router.push('/(technician)/notification' as any)}>
          <Ionicons name="notifications-outline" size={24} color="#111" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Page Title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>จัดการคำร้องแจ้งซ่อม</Text>
        </View>

        {/* Filter Categories */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                  onPress={() => setActiveCategory(cat.label)}
                  activeOpacity={0.8}
                >
                  {cat.lib === 'material' ? (
                    <MaterialCommunityIcons name={cat.icon as any} size={18} color={isActive ? '#FFFFFF' : '#6B7280'} />
                  ) : (
                    <Ionicons name={cat.icon as any} size={18} color={isActive ? '#FFFFFF' : '#6B7280'} />
                  )}
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Sort Button */}
        <View style={styles.sortRow}>
          <Text style={styles.resultText}>
            พบ {TASKS.filter(t => activeCategory === 'ทั้งหมด' || t.category === activeCategory).length} รายการ
          </Text>
          <TouchableOpacity style={styles.sortButton} activeOpacity={0.7} onPress={() => setSortModalVisible(true)}>
            <Ionicons name="filter" size={14} color="#6B7280" />
            <Text style={styles.sortButtonText}>เรียงตาม: {sortOption}</Text>
            <Ionicons name="chevron-down" size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <View style={styles.listContainer}>
          {TASKS.map((task) => {
            if (activeCategory !== 'ทั้งหมด' && activeCategory !== task.category) return null;

            const catConfig = getCategoryConfig(task.category);

            return (
              <TouchableOpacity key={task.id} style={styles.ticketCard} activeOpacity={0.7} onPress={goToDetail}>
                
                {/* แถบสีด้านซ้าย: ใช้สีตามหมวดหมู่ */}
                <View style={[styles.urgencyIndicator, { backgroundColor: catConfig.color }]} />

                <View style={styles.ticketContent}>
                  
                  {/* Top Row: Category Badge & Time */}
                  <View style={styles.ticketHeader}>
                    <View style={[styles.badge, { backgroundColor: catConfig.bg }]}>
                      <Ionicons name={catConfig.icon as any} size={14} color={catConfig.color} />
                      <Text style={[styles.badgeText, { color: catConfig.color }]}>{task.category}</Text>
                    </View>
                    <Text style={styles.timeText}>{task.time}</Text>
                  </View>

                  {/* Main Content: Issue & Room */}
                  <Text style={styles.issueTitle} numberOfLines={1}>{task.issue}</Text>
                  
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#9CA3AF" />
                    <Text style={styles.locationText}>{task.room}</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Bottom Row: Action Button */}
                  <View style={styles.ticketFooter}>
                    <View style={styles.actionBtn}>
                      <Text style={styles.actionText}>ดูรายละเอียด</Text>
                      <Ionicons name="arrow-forward" size={16} color="#F28C28" />
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Modal Dropdown สำหรับ Sort */}
      <Modal visible={sortModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เรียงลำดับข้อมูล</Text>
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
                  <Text style={[styles.modalItemText, sortOption === item && { color: '#F28C28', fontWeight: '700' }]}>{item}</Text>
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  categoryBtnActive: {
    backgroundColor: '#F28C28',
    borderColor: '#E67E22',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  urgencyIndicator: {
    width: 6,
    height: '100%',
  },
  ticketContent: {
    flex: 1,
    padding: 16,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#4B5563',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // จัดให้ปุ่มรายละเอียดไปอยู่ทางขวา
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F28C28',
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