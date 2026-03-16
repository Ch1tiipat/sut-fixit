import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ==========================================
// Mock Data
// ==========================================
const DATE_OPTIONS = ['ทั้งหมด', 'วันนี้', 'เมื่อวาน', '7 วันที่ผ่านมา', 'เดือนนี้'];

const CATEGORY_DATA = [
  { label: 'ประปา', value: 54, color: '#0EA5E9', icon: 'water' },
  { label: 'ไฟฟ้า', value: 36, color: '#EAB308', icon: 'flash' },
  { label: 'เฟอร์นิเจอร์', value: 18, color: '#8B5CF6', icon: 'bed' },
  { label: 'เครื่องใช้ไฟฟ้า', value: 12, color: '#EC4899', icon: 'tv' },
];

const DORM_DATA = [
  { label: 'สุรนิเวศ 1', value: 45, color: '#EF4444', icon: 'business' },
  { label: 'สุรนิเวศ 7', value: 32, color: '#F97316', icon: 'business' },
  { label: 'สุรนิเวศ 14', value: 28, color: '#F59E0B', icon: 'business' },
  { label: 'อื่นๆ', value: 15, color: '#6B7280', icon: 'business' },
];

export default function StatisticsChartScreen() {
  // State สำหรับสลับหน้าจอกราฟ
  const [activeTab, setActiveTab] = useState<'category' | 'dorm'>('category');

  // State สำหรับ Dropdown วันที่
  const [selectedDate, setSelectedDate] = useState('เดือนนี้');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // ดึงข้อมูลตามแท็บที่เลือก
  const currentData = activeTab === 'category' ? CATEGORY_DATA : DORM_DATA;
  
  const maxValue = Math.max(...currentData.map(d => d.value));
  const gridMax = Math.ceil(maxValue / 10) * 10; 
  const totalValue = currentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          {/* ✅ เปลี่ยนสีลูกศรเป็นสีส้มตรงนี้ */}
          <Ionicons name="chevron-back" size={26} color="#F28C28" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>สถิติเชิงลึก</Text>
        
        <TouchableOpacity 
          style={styles.dateFilterBtn} 
          activeOpacity={0.7} 
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.dateFilterText}>{selectedDate}</Text>
          <Ionicons name="chevron-down" size={14} color="#F28C28" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ========================================== */}
        {/* Segmented Control */}
        {/* ========================================== */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity 
            style={[styles.segmentBtn, activeTab === 'category' && styles.segmentBtnActive]} 
            onPress={() => setActiveTab('category')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'category' && styles.segmentTextActive]}>แยกตามหมวดหมู่</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segmentBtn, activeTab === 'dorm' && styles.segmentBtnActive]} 
            onPress={() => setActiveTab('dorm')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'dorm' && styles.segmentTextActive]}>แยกตามหอพัก</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================== */}
        {/* Summary Card */}
        {/* ========================================== */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ยอดรวมทั้งหมด ({selectedDate})</Text>
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryTotal}>{totalValue}</Text>
            <Text style={styles.summaryUnit}>รายการ</Text>
          </View>
          <View style={styles.trendRow}>
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Text style={styles.trendText}>ข้อมูลมีการอัปเดตล่าสุด</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* Bar Chart Area */}
        {/* ========================================== */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>กราฟแสดงจำนวนงานซ่อม</Text>

          <View style={styles.chartWrapper}>
            
            <View style={styles.gridLinesContainer}>
              {[gridMax, gridMax * 0.75, gridMax * 0.5, gridMax * 0.25, 0].map((val, index) => (
                <View key={index} style={styles.gridLineRow}>
                  <Text style={styles.yAxisText}>{Math.round(val)}</Text>
                  <View style={[styles.gridLine, val === 0 && styles.gridLineBase]} />
                </View>
              ))}
            </View>

            <View style={styles.barsContainer}>
              {currentData.map((item, index) => {
                const heightPercentage = (item.value / gridMax) * 100;
                
                return (
                  <View key={index} style={styles.barCol}>
                    <Text style={styles.barValueText}>{item.value}</Text>
                    
                    <View style={styles.barTrack}>
                      <View 
                        style={[
                          styles.barFill, 
                          { height: `${heightPercentage}%`, backgroundColor: item.color }
                        ]} 
                      />
                    </View>
                    
                    <Text style={styles.xAxisText} numberOfLines={1}>{item.label}</Text>
                  </View>
                );
              })}
            </View>

          </View>
        </View>

        {/* ========================================== */}
        {/* Detailed Data Table */}
        {/* ========================================== */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>รายละเอียดข้อมูล</Text>
          
          <View style={styles.tableBox}>
            {currentData.map((item, index) => {
              const percentage = ((item.value / totalValue) * 100).toFixed(1);
              
              return (
                <View key={index} style={[styles.tableRow, index === currentData.length - 1 && { borderBottomWidth: 0 }]}>
                  
                  <View style={styles.tableLabelCol}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text style={styles.tableLabelText}>{item.label}</Text>
                  </View>

                  <View style={styles.tableValueCol}>
                    <Text style={styles.tableCountText}>{item.value} งาน</Text>
                    <Text style={styles.tablePercentText}>{percentage}%</Text>
                  </View>

                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>

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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2D7C4',
    gap: 4,
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F28C28',
  },
  
  scrollContent: {
    paddingBottom: 40,
  },

  // Segmented Control
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#111827',
    fontWeight: '800',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  summaryTotal: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
  },
  summaryUnit: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },

  // Chart Container
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  chartWrapper: {
    height: 220,
    flexDirection: 'row',
    position: 'relative',
  },
  
  // Grid Lines
  gridLinesContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
  gridLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisText: {
    width: 30, 
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'right',
    marginRight: 8,
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  gridLineBase: {
    backgroundColor: '#D1D5DB',
  },

  // Bars
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginLeft: 38,
    paddingBottom: 2,
  },
  barCol: {
    alignItems: 'center',
    width: 50,
  },
  barValueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    marginBottom: 4,
  },
  barTrack: {
    width: 32,
    height: 160,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  xAxisText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  // Data Table
  tableContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  tableBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  tableLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tableValueCol: {
    alignItems: 'flex-end',
  },
  tableCountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  tablePercentText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Filter Date Modal
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