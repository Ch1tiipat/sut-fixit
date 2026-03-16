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
  {
    id: '1',
    room: 'B-402',
    dorm: 'สุรนิเวศ 1',
    issue: 'ท่อน้ำรั่วในห้องน้ำ',
    time: '12 ก.พ. 2567',
    category: 'ประปา',
    status: 'เสร็จสิ้น',
    studentId: 'B670001',
    phone: '091-123-4567',
    images: ['https://i.imgur.com/8Km9tLL.jpg', 'https://i.imgur.com/jNNT4LE.jpg'],
  },
  {
    id: '2',
    room: 'A-105',
    dorm: 'สุรนิเวศ 7',
    issue: 'แอร์ไม่เย็น มีน้ำหยด',
    time: '10 ก.พ. 2567',
    category: 'เครื่องใช้ไฟฟ้า',
    status: 'เสร็จสิ้น',
    studentId: 'B670002',
    phone: '089-555-7777',
    images: ['https://i.imgur.com/8Km9tLL.jpg'],
  },
  {
    id: '3',
    room: 'C-301',
    dorm: 'สุรนิเวศ 14',
    issue: 'ขาเตียงหัก',
    time: '05 ก.พ. 2567',
    category: 'เฟอร์นิเจอร์',
    status: 'เสร็จสิ้น',
    studentId: 'B670003',
    phone: '081-222-3333',
    images: [],
  },
  {
    id: '4',
    room: 'B-102',
    dorm: 'สุรนิเวศ 8',
    issue: 'หลอดไฟทางเดินเสีย',
    time: '01 ก.พ. 2567',
    category: 'ไฟฟ้า',
    status: 'เสร็จสิ้น',
    studentId: 'B670004',
    phone: '080-999-8888',
    images: ['https://i.imgur.com/jNNT4LE.jpg'],
  },
];

const DATE_OPTIONS = ['ทั้งหมด', 'วันนี้', 'เมื่อวาน', '7 วันที่ผ่านมา'];
const CATEGORY_OPTIONS = ['ทั้งหมด', 'ประปา', 'ไฟฟ้า', 'เฟอร์นิเจอร์', 'เครื่องใช้ไฟฟ้า', 'อื่นๆ'];
const FEMALE_DORMS = ['สุรนิเวศ 1', 'สุรนิเวศ 2', 'สุรนิเวศ 3', 'สุรนิเวศ 4', 'สุรนิเวศ 5', 'สุรนิเวศ 6', 'สุรนิเวศ 14', 'สุรนิเวศ 15', 'สุรนิเวศ 16', 'สุรนิเวศ 18'];
const MALE_DORMS = ['สุรนิเวศ 7', 'สุรนิเวศ 8', 'สุรนิเวศ 9', 'สุรนิเวศ 10', 'สุรนิเวศ 11', 'สุรนิเวศ 12', 'สุรนิเวศ 13', 'สุรนิเวศ 17'];

export default function AdminHistoryScreen() {
  const [selectedDate, setSelectedDate] = useState('ทั้งหมด');
  const [selectedDorm, setSelectedDorm] = useState('ทั้งหมด');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<'date' | 'dorm' | 'category'>('date');

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  
  const [imageViewer, setImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getFilterOptions = () => {
    if (filterType === 'date') return DATE_OPTIONS;
    if (filterType === 'category') return CATEGORY_OPTIONS;
    return [];
  };

  const getFilterTitle = () => {
    if (filterType === 'date') return 'เลือกวันที่';
    if (filterType === 'dorm') return 'เลือกหอพัก';
    if (filterType === 'category') return 'เลือกประเภท';
    return '';
  };

  const getCurrentSelection = () => {
    if (filterType === 'date') return selectedDate;
    if (filterType === 'dorm') return selectedDorm;
    if (filterType === 'category') return selectedCategory;
    return '';
  };

  const handleSelectFilter = (item: string) => {
    if (filterType === 'date') setSelectedDate(item);
    if (filterType === 'dorm') setSelectedDorm(item);
    if (filterType === 'category') setSelectedCategory(item);
    setFilterModalVisible(false);
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'ประปา': return { icon: 'water', color: '#0EA5E9', bg: '#E0F2FE' };
      case 'ไฟฟ้า': return { icon: 'flash', color: '#EAB308', bg: '#FEF9C3' };
      case 'เฟอร์นิเจอร์': return { icon: 'bed', color: '#8B5CF6', bg: '#EDE9FE' };
      case 'เครื่องใช้ไฟฟ้า': return { icon: 'tv', color: '#EC4899', bg: '#FCE7F3' };
      default: return { icon: 'build', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const safeCategory = selectedRepair?.category || selectedRepair?.type || 'ทั่วไป';
  const repairConfig = getCategoryConfig(safeCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      
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
        
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>ประวัติการซ่อม</Text>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterDropdown, selectedDate !== 'ทั้งหมด' && styles.filterDropdownActive]} activeOpacity={0.7} onPress={() => { setFilterType('date'); setFilterModalVisible(true); }}>
            <Text style={[styles.filterText, selectedDate !== 'ทั้งหมด' && styles.filterTextActive]} numberOfLines={1}>{selectedDate === 'ทั้งหมด' ? 'วันที่' : selectedDate}</Text>
            <Ionicons name="chevron-down" size={14} color={selectedDate !== 'ทั้งหมด' ? '#F28C28' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterDropdown, selectedDorm !== 'ทั้งหมด' && styles.filterDropdownActive]} activeOpacity={0.7} onPress={() => { setFilterType('dorm'); setFilterModalVisible(true); }}>
            <Text style={[styles.filterText, selectedDorm !== 'ทั้งหมด' && styles.filterTextActive]} numberOfLines={1}>{selectedDorm === 'ทั้งหมด' ? 'หอพัก' : selectedDorm}</Text>
            <Ionicons name="chevron-down" size={14} color={selectedDorm !== 'ทั้งหมด' ? '#F28C28' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterDropdown, selectedCategory !== 'ทั้งหมด' && styles.filterDropdownActive]} activeOpacity={0.7} onPress={() => { setFilterType('category'); setFilterModalVisible(true); }}>
            <Text style={[styles.filterText, selectedCategory !== 'ทั้งหมด' && styles.filterTextActive]} numberOfLines={1}>{selectedCategory === 'ทั้งหมด' ? 'ประเภท' : selectedCategory}</Text>
            <Ionicons name="chevron-down" size={14} color={selectedCategory !== 'ทั้งหมด' ? '#F28C28' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {HISTORY_TASKS.map((task: any) => {
            const taskCategory = task?.category || task?.type || 'ทั่วไป';
            const taskDorm = task?.dorm || 'ไม่ระบุ';
            const taskRoom = task?.room || 'ไม่ระบุ';
            const taskIssue = task?.issue || task?.problem || 'ไม่ระบุปัญหา';
            const taskTime = task?.time || 'ไม่ระบุ';

            if (selectedCategory !== 'ทั้งหมด' && selectedCategory !== taskCategory) return null;
            if (selectedDorm !== 'ทั้งหมด' && taskDorm !== selectedDorm) return null;

            const catConfig = getCategoryConfig(taskCategory);

            return (
              <TouchableOpacity 
                key={task.id} 
                style={styles.ticketCard} 
                activeOpacity={0.7} 
                onPress={() => {
                  setSelectedRepair(task);
                  setOpenDetail(true);
                }}
              >
                <View style={[styles.urgencyIndicator, { backgroundColor: catConfig.color }]} />
                <View style={styles.ticketContent}>
                  
                  <View style={styles.ticketHeader}>
                    <View style={[styles.badge, { backgroundColor: catConfig.bg }]}>
                      <Ionicons name={catConfig.icon as any} size={14} color={catConfig.color} />
                      <Text style={[styles.badgeText, { color: catConfig.color }]}>{taskCategory}</Text>
                    </View>
                    <Text style={styles.timeText}>{taskTime}</Text>
                  </View>

                  <Text style={styles.issueTitle} numberOfLines={1}>{taskIssue}</Text>
                  
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#9CA3AF" />
                    <Text style={styles.locationText}>{taskDorm} ・ ห้อง {taskRoom}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.ticketFooter}>
                    <View style={styles.statusRow}>
                      <Text style={[styles.statusText, { color: '#10B981' }]}>
                        สถานะ: เสร็จสิ้น
                      </Text>
                    </View>
                    
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

      <Modal visible={openDetail} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.detailBox}>
            
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setOpenDetail(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.detailTitle}>รายละเอียดประวัติการซ่อม</Text>
              <View style={styles.spacer} />
            </View>

            {selectedRepair ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailScrollContent}>
                
                <View style={styles.detailCategoryRow}>
                   <View style={[styles.badge, { backgroundColor: repairConfig.bg, paddingHorizontal: 12, paddingVertical: 6 }]}>
                      <Ionicons name={repairConfig.icon as any} size={16} color={repairConfig.color} />
                      <Text style={[styles.badgeText, { color: repairConfig.color, fontSize: 14 }]}>{safeCategory}</Text>
                    </View>
                    <Text style={[styles.detailStatusText, { color: '#10B981' }]}>
                      เสร็จสิ้น
                    </Text>
                </View>

                <Text style={styles.detailIssueTitle}>
                  {selectedRepair?.issue || selectedRepair?.problem || 'ไม่มีการระบุรายละเอียดปัญหา'}
                </Text>

                <View style={styles.detailInfoBox}>
                  <View style={styles.detailInfoRow}>
                     <Ionicons name="location-outline" size={20} color="#6B7280" />
                     <View style={styles.detailInfoTextGroup}>
                       <Text style={styles.detailInfoLabel}>สถานที่</Text>
                       <Text style={styles.detailInfoValue}>{selectedRepair?.dorm || '-'} / ห้อง {selectedRepair?.room || '-'}</Text>
                     </View>
                  </View>
                  
                  <View style={styles.detailInfoDivider} />

                  <View style={styles.detailInfoRow}>
                     <Ionicons name="person-outline" size={20} color="#6B7280" />
                     <View style={styles.detailInfoTextGroup}>
                       <Text style={styles.detailInfoLabel}>ผู้แจ้ง (รหัสนักศึกษา)</Text>
                       <Text style={styles.detailInfoValue}>{selectedRepair?.studentId || 'ไม่ระบุข้อมูล'}</Text>
                     </View>
                  </View>

                  <View style={styles.detailInfoDivider} />

                  <View style={styles.detailInfoRow}>
                     <Ionicons name="call-outline" size={20} color="#6B7280" />
                     <View style={styles.detailInfoTextGroup}>
                       <Text style={styles.detailInfoLabel}>เบอร์โทรศัพท์</Text>
                       <Text style={styles.detailInfoValue}>{selectedRepair?.phone || 'ไม่ระบุข้อมูล'}</Text>
                     </View>
                  </View>
                </View>

                {Array.isArray(selectedRepair?.images) && selectedRepair.images.length > 0 ? (
                  <View style={styles.detailImageSection}>
                    <Text style={styles.detailSectionTitle}>รูปภาพประกอบ</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScrollContent}>
                      {selectedRepair.images.map((img: string, index: number) => (
                        <TouchableOpacity key={index} onPress={() => { setSelectedImage(img); setImageViewer(true); }} activeOpacity={0.8}>
                          <Image source={{ uri: img }} style={styles.galleryImage} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}

                <View style={styles.detailTimeContainer}>
                  <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.detailTimeText}>ซ่อมสำเร็จเมื่อ: {selectedRepair?.time || 'ไม่ระบุ'}</Text>
                </View>

              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal visible={imageViewer} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.imageModalBg} onPress={() => setImageViewer(false)} activeOpacity={1}>
          <TouchableOpacity style={styles.closeImageBtn} onPress={() => setImageViewer(false)}>
             <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.fullImage} /> : null}
        </TouchableOpacity>
      </Modal>

      <Modal visible={filterModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlayFilter} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContentFilter}>
            <View style={styles.modalHeaderFilter}>
              <Text style={styles.modalTitleFilter}>{getFilterTitle()}</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {filterType === 'dorm' ? (
              <ScrollView style={styles.dormScrollArea} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.modalItemFilter} onPress={() => handleSelectFilter('ทั้งหมด')}>
                  <Text style={[styles.modalItemTextFilter, selectedDorm === 'ทั้งหมด' && styles.modalItemTextFilterActive]}>ทั้งหมด</Text>
                  {selectedDorm === 'ทั้งหมด' ? <Ionicons name="checkmark-circle" size={20} color="#F28C28" /> : null}
                </TouchableOpacity>

                <View style={styles.sectionHeaderContainer}>
                  <Ionicons name="woman" size={16} color="#EC4899" />
                  <Text style={[styles.sectionHeader, styles.femaleHeader]}>หอพักหญิง</Text>
                </View>
                {FEMALE_DORMS.map((dorm) => (
                  <TouchableOpacity key={dorm} style={styles.modalSubItem} onPress={() => handleSelectFilter(dorm)}>
                    <Text style={[styles.modalItemTextFilter, selectedDorm === dorm && styles.modalItemTextFilterActive]}>{dorm}</Text>
                    {selectedDorm === dorm ? <Ionicons name="checkmark-circle" size={20} color="#F28C28" /> : null}
                  </TouchableOpacity>
                ))}

                <View style={styles.sectionHeaderContainer}>
                  <Ionicons name="man" size={16} color="#3B82F6" />
                  <Text style={[styles.sectionHeader, styles.maleHeader]}>หอพักชาย</Text>
                </View>
                {MALE_DORMS.map((dorm) => (
                  <TouchableOpacity key={dorm} style={styles.modalSubItem} onPress={() => handleSelectFilter(dorm)}>
                    <Text style={[styles.modalItemTextFilter, selectedDorm === dorm && styles.modalItemTextFilterActive]}>{dorm}</Text>
                    {selectedDorm === dorm ? <Ionicons name="checkmark-circle" size={20} color="#F28C28" /> : null}
                  </TouchableOpacity>
                ))}
                <View style={styles.bottomSpacer} />
              </ScrollView>
            ) : (
              <FlatList
                data={getFilterOptions()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = getCurrentSelection() === item;
                  return (
                    <TouchableOpacity style={styles.modalItemFilter} onPress={() => handleSelectFilter(item)}>
                      <Text style={[styles.modalItemTextFilter, isSelected && styles.modalItemTextFilterActive]}>{item}</Text>
                      {isSelected ? <Ionicons name="checkmark-circle" size={20} color="#F28C28" /> : null}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  filterDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterDropdownActive: {
    borderColor: '#F28C28',
    backgroundColor: '#FFF3E8',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    flex: 1,
  },
  filterTextActive: {
    color: '#F28C28',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
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
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailBox: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeBtn: {
    padding: 4,
  },
  spacer: {
    width: 32,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  detailScrollContent: {
    paddingBottom: 20,
  },
  detailCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailStatusText: {
    fontSize: 15,
    fontWeight: '800',
  },
  detailIssueTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
    lineHeight: 30,
  },
  detailInfoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailInfoTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  detailInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailInfoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  detailInfoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
    marginLeft: 32,
  },
  detailImageSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  imageScrollContent: {
    gap: 12,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  detailTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  detailTimeText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 6,
    fontWeight: '500',
  },
  imageModalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeImageBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    padding: 8,
    zIndex: 10,
  },
  fullImage: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
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
    maxHeight: '75%',
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
  dormScrollArea: {
    width: '100%',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 8,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
  },
  femaleHeader: {
    color: '#EC4899',
  },
  maleHeader: {
    color: '#3B82F6',
  },
  modalSubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 20,
  },
});