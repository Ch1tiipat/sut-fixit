import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
// Component: การ์ดรายการแจ้งซ่อม 
// ==========================================
type RequestCardProps = {
  iconType: 'material' | 'ionicon' | 'feather';
  iconName: string;
  iconColor: string;
  iconBg: string;
  title: string;
  location: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  showActions?: boolean; 
};

function RequestCard({
  iconType,
  iconName,
  iconColor,
  iconBg,
  title,
  location,
  date,
  status,
  statusColor,
  statusBg,
  showActions = false,
}: RequestCardProps) {
  const renderIcon = () => {
    if (iconType === 'material') {
      return <MaterialCommunityIcons name={iconName as any} size={22} color={iconColor} />;
    }
    if (iconType === 'feather') {
      return <Feather name={iconName as any} size={20} color={iconColor} />;
    }
    return <Ionicons name={iconName as any} size={20} color={iconColor} />;
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/service-completed')}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            {renderIcon()}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>{location}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottomRow}>
        <Text style={styles.cardDate}>สร้างเมื่อ {date}</Text>
        
        {/* ========================================== */}
        {/* โซนปุ่ม Action (ลบ, แก้ไข, รายละเอียด)           */}
        {/* ========================================== */}
        <View style={styles.cardActionRow}>
          {showActions && (
            <>
              <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
              
              {/* === เพิ่มลิงก์ไปหน้าแก้ไขการแจ้งซ่อมที่ปุ่มดินสอ === */}
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.actionBtn}
                onPress={() => router.push('/edit-report')}
              >
                <Feather name="edit-2" size={16} color="#4B5563" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.detailBtn} onPress={() => router.push('/service-completed')} activeOpacity={0.7}>
            <Text style={styles.detailText}>รายละเอียด</Text>
            <Ionicons name="chevron-forward" size={16} color="#F28C28" />
          </TouchableOpacity>
        </View>

      </View>
    </TouchableOpacity>
  );
}

// ==========================================
// Main Screen: HistoryScreen
// ==========================================
export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [sortOption, setSortOption] = useState('ใหม่ล่าสุด');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const TABS = ['ทั้งหมด', 'รอดำเนินการ', 'กำลังดำเนินการ', 'เสร็จสมบูรณ์'];
  const SORT_OPTIONS = ['ใหม่ล่าสุด', 'เก่าที่สุด', 'อัปเดตล่าสุด'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          {/* ✅ แก้ไข Path รูปภาพตรงนี้แล้ว (เพิ่ม ../) */}
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
        <TouchableOpacity 
          style={styles.notificationBtn} 
          activeOpacity={0.7} 
          onPress={() => router.push('/notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#111" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>ประวัติ-การแจ้งซ่อม</Text>
      </View>

      {/* Tabs Filter */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Dropdown Button */}
      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.sortButton} activeOpacity={0.7} onPress={() => setSortModalVisible(true)}>
          <Ionicons name="filter" size={14} color="#6B7280" />
          <Text style={styles.sortButtonText}>เรียงตาม: {sortOption}</Text>
          <Ionicons name="chevron-down" size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Request List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* รายการนี้รอดำเนินการ จะเปิดให้มีปุ่มลบ/แก้ไข */}
        <RequestCard
          iconType="material"
          iconName="water-pump"
          iconColor="#F28C28"
          iconBg="#FFF3E8"
          title="ก๊อกน้ำรั่ว"
          location="หอพัก 1 ・ ห้อง 102"
          date="24 ต.ค. 2568"
          status="รอดำเนินการ"
          statusColor="#D97706"
          statusBg="#FEF3C7"
          showActions={true} 
        />

        <RequestCard
          iconType="ionicon"
          iconName="flash"
          iconColor="#2563EB"
          iconBg="#DBEAFE"
          title="ไฟเพดานกระพริบ"
          location="หอพัก 1 ・ โซนห้องนอน"
          date="22 ต.ค. 2568"
          status="กำลังดำเนินการ"
          statusColor="#1D4ED8"
          statusBg="#BFDBFE"
        />

        <RequestCard
          iconType="feather"
          iconName="wind"
          iconColor="#059669"
          iconBg="#D1FAE5"
          title="ล้างแผ่นกรองแอร์"
          location="หอพัก 1 ・ ห้องนอน"
          date="19 ต.ค. 2568"
          status="เสร็จสมบูรณ์"
          statusColor="#047857"
          statusBg="#A7F3D0"
        />

        <RequestCard
          iconType="ionicon"
          iconName="bed-outline"
          iconColor="#7C3AED"
          iconBg="#EDE9FE"
          title="เตียงนอนขาหัก"
          location="หอพัก 1 ・ ห้อง 102"
          date="10 ต.ค. 2568"
          status="เสร็จสมบูรณ์"
          statusColor="#059669"
          statusBg="#A7F3D0"
        />
        
      </ScrollView>

      {/* Modal Dropdown สำหรับเรียงลำดับ (Sort) */}
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
  tabContainer: {
    marginBottom: 16,
  },
  tabScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 10, 
    paddingHorizontal: 18,
    borderRadius: 24, 
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabButtonActive: {
    backgroundColor: '#F28C28',
    borderColor: '#E67E22',
  },
  tabText: {
    fontSize: 14, 
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'flex-end', 
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
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    height: 145, 
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginRight: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F28C28',
    marginRight: 2,
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