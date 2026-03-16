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

// ==========================================
// Mock Data สำหรับสถิติ
// ==========================================
const DATE_OPTIONS = ['ทั้งหมด', 'วันนี้', 'เมื่อวาน', '7 วันที่ผ่านมา', 'เดือนนี้'];

const TOP_DORMS = [
  { id: '1', rank: 1, name: 'สุรนิเวศ 1', count: 45, color: '#EF4444' },
  { id: '2', rank: 2, name: 'สุรนิเวศ 7', count: 32, color: '#F97316' },
  { id: '3', rank: 3, name: 'สุรนิเวศ 14', count: 28, color: '#F59E0B' },
];

const ALL_DORMS_STATS = [
  { id: 'f1', name: 'สุรนิเวศ 1', type: 'female', count: 45 },
  { id: 'm1', name: 'สุรนิเวศ 7', type: 'male', count: 32 },
  { id: 'f2', name: 'สุรนิเวศ 14', type: 'female', count: 28 },
  { id: 'm2', name: 'สุรนิเวศ 8', type: 'male', count: 18 },
  { id: 'f3', name: 'สุรนิเวศ 2', type: 'female', count: 14 },
  { id: 'm3', name: 'สุรนิเวศ 9', type: 'male', count: 10 },
  { id: 'f4', name: 'สุรนิเวศ 3', type: 'female', count: 8 },
  { id: 'f5', name: 'สุรนิเวศ 4', type: 'female', count: 5 },
  { id: 'm4', name: 'สุรนิเวศ 10', type: 'male', count: 4 },
  { id: 'f6', name: 'สุรนิเวศ 5', type: 'female', count: 3 },
  { id: 'f7', name: 'สุรนิเวศ 6', type: 'female', count: 2 },
  { id: 'm5', name: 'สุรนิเวศ 11', type: 'male', count: 1 },
  { id: 'm6', name: 'สุรนิเวศ 12', type: 'male', count: 0 },
  { id: 'm7', name: 'สุรนิเวศ 13', type: 'male', count: 0 },
  { id: 'f8', name: 'สุรนิเวศ 15', type: 'female', count: 0 },
  { id: 'f9', name: 'สุรนิเวศ 16', type: 'female', count: 0 },
  { id: 'm8', name: 'สุรนิเวศ 17', type: 'male', count: 0 },
  { id: 'f10', name: 'สุรนิเวศ 18', type: 'female', count: 0 },
].sort((a, b) => b.count - a.count);

const TOP_TECHS = [
  { id: '1', rank: 1, name: 'นายสมชาย ใจดี', type: 'ช่างไฟฟ้า', count: 42, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', rank: 2, name: 'นายสมเกียรติ ขยัน', type: 'ช่างประปา', count: 35, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', rank: 3, name: 'นายมานะ อดทน', type: 'ช่างทั่วไป', count: 29, avatar: 'https://i.pravatar.cc/150?u=3' },
];

// ข้อมูลจำลองสำหรับช่างทั้งหมด (จัดอันดับแล้ว)
const ALL_TECHS_STATS = [
  { id: 't1', name: 'นายสมชาย ใจดี', type: 'ช่างไฟฟ้า', count: 42, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 't2', name: 'นายสมเกียรติ ขยัน', type: 'ช่างประปา', count: 35, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 't3', name: 'นายมานะ อดทน', type: 'ช่างทั่วไป', count: 29, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 't4', name: 'นายวิชัย เก่งกาจ', type: 'ช่างเครื่องใช้ไฟฟ้า', count: 18, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 't5', name: 'นายสุรพล พัฒนา', type: 'ช่างเฟอร์นิเจอร์', count: 12, avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 't6', name: 'นายธวัชชัย รวดเร็ว', type: 'ช่างประปา', count: 5, avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 't7', name: 'นายเอกพล มั่นคง', type: 'ช่างไฟฟ้า', count: 2, avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 't8', name: 'นายสมภพ ปลอดภัย', type: 'ช่างทั่วไป', count: 0, avatar: 'https://i.pravatar.cc/150?u=8' },
].sort((a, b) => b.count - a.count);

export default function AdminStatisticsScreen() {
  const [selectedDate, setSelectedDate] = useState('เดือนนี้');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // State ควบคุมหน้า Pop-up ต่างๆ
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [allDormsModalVisible, setAllDormsModalVisible] = useState(false);
  const [allTechsModalVisible, setAllTechsModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ผู้ดูแลระบบ (Admin)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7} onPress={() => router.push('/(admin)/notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color="#111" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ========================================== */}
        {/* Title & Filter Dropdown */}
        {/* ========================================== */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>สถิติการซ่อม</Text>
          <TouchableOpacity 
            style={styles.dateFilterBtn} 
            activeOpacity={0.7} 
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.dateFilterText}>{selectedDate}</Text>
            <Ionicons name="chevron-down" size={14} color="#F28C28" />
          </TouchableOpacity>
        </View>

        {/* ========================================== */}
        {/* Stats Grid */}
        {/* ========================================== */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { borderTopColor: '#6B7280' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="document-text" size={20} color="#6B7280" />
            </View>
            <Text style={styles.statCount}>120</Text>
            <Text style={styles.statLabel}>งานทั้งหมด</Text>
          </View>

          <View style={[styles.statBox, { borderTopColor: '#F59E0B' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statCount}>15</Text>
            <Text style={styles.statLabel}>รอดำเนินการ</Text>
          </View>

          <View style={[styles.statBox, { borderTopColor: '#3B82F6' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="build" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statCount}>5</Text>
            <Text style={styles.statLabel}>กำลังซ่อม</Text>
          </View>

          <View style={[styles.statBox, { borderTopColor: '#10B981' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <Text style={styles.statCount}>100</Text>
            <Text style={styles.statLabel}>เสร็จสิ้น</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* สัดส่วนงานซ่อมตามหมวดหมู่ */}
        {/* ========================================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>สัดส่วนงานซ่อมตามหมวดหมู่</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.chartBox} 
            activeOpacity={0.8}
            onPress={() => setCategoryModalVisible(true)}
          >
            <View style={styles.progressRow}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>ประปา (45%)</Text>
                <Text style={styles.progressValue}>54 งาน</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '45%', backgroundColor: '#0EA5E9' }]} />
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>ไฟฟ้า (30%)</Text>
                <Text style={styles.progressValue}>36 งาน</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '30%', backgroundColor: '#EAB308' }]} />
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>เฟอร์นิเจอร์ (15%)</Text>
                <Text style={styles.progressValue}>18 งาน</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '15%', backgroundColor: '#8B5CF6' }]} />
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>เครื่องใช้ไฟฟ้า (10%)</Text>
                <Text style={styles.progressValue}>12 งาน</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '10%', backgroundColor: '#EC4899' }]} />
              </View>
            </View>

            <View style={styles.clickHintRow}>
              <Text style={styles.clickHintText}>แตะเพื่อดูรายละเอียดเชิงลึก</Text>
              <Ionicons name="arrow-forward-circle-outline" size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ========================================== */}
        {/* TOP 3 หอพักที่แจ้งซ่อมเยอะที่สุด */}
        {/* ========================================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>ยอดหอพักที่แจ้งซ่อมสูงสุด (Top 3)</Text>
            <TouchableOpacity onPress={() => setAllDormsModalVisible(true)} activeOpacity={0.7}>
              <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rankingBox}>
            {TOP_DORMS.map((dorm) => (
              <View key={dorm.id} style={styles.rankingRow}>
                <View style={[styles.rankBadge, { backgroundColor: dorm.color }]}>
                  <Text style={styles.rankText}>#{dorm.rank}</Text>
                </View>
                <Text style={styles.rankingName}>{dorm.name}</Text>
                <Text style={styles.rankingCount}>{dorm.count} รายการ</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ========================================== */}
        {/* TOP 3 ช่างที่รับงานเยอะที่สุด */}
        {/* ========================================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>ยอดช่างที่รับงานสูงสุด (Top 3)</Text>
            {/* 🟢 ปุ่มกดดูยอดช่างทั้งหมด */}
            <TouchableOpacity onPress={() => setAllTechsModalVisible(true)} activeOpacity={0.7}>
              <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rankingBox}>
            {TOP_TECHS.map((tech) => (
              <View key={tech.id} style={styles.rankingRow}>
                <Image source={{ uri: tech.avatar }} style={styles.avatarImage} />
                <View style={styles.techInfo}>
                  <Text style={styles.rankingName}>{tech.name}</Text>
                  <Text style={styles.techType}>{tech.type}</Text>
                </View>
                <View style={styles.techCountBadge}>
                  <Text style={styles.techCountText}>{tech.count} งาน</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* ========================================== */}
      {/* 🟢 MODAL: ยอดช่างที่รับงานทั้งหมด (Pop-up ใหม่) */}
      {/* ========================================== */}
      <Modal visible={allTechsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={[styles.detailBox, { maxHeight: '90%' }]}>
            
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>ยอดรับงานช่างทั้งหมด</Text>
              <TouchableOpacity onPress={() => setAllTechsModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.detailSubList}>
                {ALL_TECHS_STATS.map((tech, index) => {
                  const isTop3 = index < 3;
                  return (
                    <View key={tech.id} style={[styles.subListItem, { paddingVertical: 12 }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={[
                          styles.subListLabel, 
                          { width: 26, fontWeight: '800', color: isTop3 ? '#F28C28' : '#9CA3AF' }
                        ]}>
                          #{index + 1}
                        </Text>
                        <Image source={{ uri: tech.avatar }} style={[styles.avatarImage, { width: 36, height: 36, marginRight: 12 }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.subListLabel, { fontWeight: isTop3 ? '700' : '500', marginBottom: 2 }]}>{tech.name}</Text>
                          <Text style={{ fontSize: 12, color: '#6B7280' }}>{tech.type}</Text>
                        </View>
                      </View>
                      
                      <View style={[styles.techCountBadge, { backgroundColor: isTop3 ? '#FFF3E8' : '#F3F4F6' }]}>
                        <Text style={[styles.techCountText, { color: isTop3 ? '#F28C28' : '#4B5563' }]}>{tech.count} งาน</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL: ยอดรวมทุกหอพัก */}
      {/* ========================================== */}
      <Modal visible={allDormsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={[styles.detailBox, { maxHeight: '90%' }]}>
            
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>ยอดแจ้งซ่อมทุกหอพัก</Text>
              <TouchableOpacity onPress={() => setAllDormsModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.detailSubList}>
                {ALL_DORMS_STATS.map((dorm, index) => (
                  <View key={dorm.id} style={styles.subListItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[
                        styles.subListLabel, 
                        { width: 26, fontWeight: '800', color: index < 3 ? '#F28C28' : '#9CA3AF' }
                      ]}>
                        #{index + 1}
                      </Text>
                      <Ionicons 
                        name={dorm.type === 'female' ? 'woman' : 'man'} 
                        size={16} 
                        color={dorm.type === 'female' ? '#EC4899' : '#3B82F6'} 
                        style={{ marginRight: 8 }} 
                      />
                      <Text style={[styles.subListLabel, { fontWeight: index < 3 ? '700' : '500' }]}>{dorm.name}</Text>
                    </View>
                    <Text style={styles.subListValue}>{dorm.count} รายการ</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL: รายละเอียดสัดส่วนหมวดหมู่เชิงลึก */}
      {/* ========================================== */}
      <Modal visible={categoryModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.detailBox}>
            
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>รายงานหมวดหมู่เชิงลึก</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              <Text style={styles.modalSubTitle}>ยอดแจ้งซ่อม "ประปา" (แยกตามหอพัก)</Text>
              <View style={styles.detailSubList}>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 1</Text>
                  <Text style={styles.subListValue}>24 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 7</Text>
                  <Text style={styles.subListValue}>15 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 14</Text>
                  <Text style={styles.subListValue}>15 รายการ</Text>
                </View>
              </View>

              <Text style={styles.modalSubTitle}>ยอดแจ้งซ่อม "ไฟฟ้า" (แยกตามหอพัก)</Text>
              <View style={styles.detailSubList}>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 2</Text>
                  <Text style={styles.subListValue}>20 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 8</Text>
                  <Text style={styles.subListValue}>10 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 1</Text>
                  <Text style={styles.subListValue}>6 รายการ</Text>
                </View>
              </View>

              <Text style={styles.modalSubTitle}>ยอดแจ้งซ่อม "เครื่องใช้ไฟฟ้า" (แยกตามหอพัก)</Text>
              <View style={styles.detailSubList}>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 7</Text>
                  <Text style={styles.subListValue}>12 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 14</Text>
                  <Text style={styles.subListValue}>8 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 1</Text>
                  <Text style={styles.subListValue}>5 รายการ</Text>
                </View>
              </View>

              <Text style={styles.modalSubTitle}>ยอดแจ้งซ่อม "เฟอร์นิเจอร์" (แยกตามหอพัก)</Text>
              <View style={styles.detailSubList}>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 1</Text>
                  <Text style={styles.subListValue}>10 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 8</Text>
                  <Text style={styles.subListValue}>5 รายการ</Text>
                </View>
                <View style={styles.subListItem}>
                  <Text style={styles.subListLabel}>สุรนิเวศ 14</Text>
                  <Text style={styles.subListValue}>3 รายการ</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.exportBtn} 
                activeOpacity={0.8} 
                onPress={() => {
                  setCategoryModalVisible(false); 
                  router.push('/(admin)/statistics-chart' as any); 
                }}
              >
                <Ionicons name="bar-chart-outline" size={20} color="#FFFFFF" />
                <Text style={styles.exportBtnText}>ดูสถิติรูปแบบกราฟแบบละเอียด</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL: สำหรับเลือก Filter วันที่ */}
      {/* ========================================== */}
      <Modal visible={filterModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlayFilter} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContentFilter}>
            <View style={styles.modalHeaderFilter}>
              <Text style={styles.modalTitleFilter}>เลือกช่วงเวลาสถิติ</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={DATE_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = selectedDate === item;
                return (
                  <TouchableOpacity 
                    style={styles.modalItemFilter} 
                    onPress={() => {
                      setSelectedDate(item);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemTextFilter, isSelected && styles.modalItemTextFilterActive]}>{item}</Text>
                    {isSelected ? <Ionicons name="checkmark-circle" size={20} color="#F28C28" /> : null}
                  </TouchableOpacity>
                );
              }}
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
    color: '#EF4444',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2D7C4',
    gap: 6,
  },
  dateFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F28C28',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statBox: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F28C28',
  },
  chartBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  
  progressRow: {
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  clickHintRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  clickHintText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  rankingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 12,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  rankingName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rankingCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F28C28',
  },
  
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  techInfo: {
    flex: 1,
  },
  techType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  techCountBadge: {
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  techCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F28C28',
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  detailBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  closeBtn: {
    padding: 4,
  },
  modalSubTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    marginTop: 10,
  },
  detailSubList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subListLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  subListValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F28C28',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  modalOverlayFilter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContentFilter: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    maxHeight: '60%',
  },
  modalHeaderFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 10,
  },
  modalTitleFilter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalItemFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemTextFilter: {
    fontSize: 16,
    color: '#4B5563',
  },
  modalItemTextFilterActive: {
    color: '#F28C28',
    fontWeight: '700',
  },
});