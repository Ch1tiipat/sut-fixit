import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
// Mock Data (จำลองข้อมูลสำหรับหน้าตรวจงานโดยเฉพาะ)
// ==========================================
const REVIEW_TASKS = [
  {
    id: 'SUT-8829',
    room: 'B-402',
    dorm: 'สุรนิเวศ 1',
    issue: 'ซ่อมกลอนประตู',
    action: 'เปลี่ยนกลอนลูกบิดใหม่',
    time: '10 นาทีที่แล้ว',
    category: 'ทั่วไป',
    status: 'รอตรวจงาน',
    studentId: 'B670001',
    techName: 'นัททวัฒน์ เอื้อสี',
    techPhone: '091-xxx-xxxx',
    techAvatar: 'https://i.pravatar.cc/150?u=1',
    note: 'โคมไฟในห้องหลักกระพริบและดับลง ช่างได้ดำเนินการเปลี่ยนบัลลาสต์และหลอดไฟใหม่ให้เรียบร้อยแล้ว',
    cost: '100',
    beforeImage: 'https://i.imgur.com/8Km9tLL.jpg', // ใส่รูปจำลองก่อนทำ
    afterImage: 'https://i.imgur.com/jNNT4LE.jpg',   // ใส่รูปจำลองหลังทำ
  },
  {
    id: 'SUT-8830',
    room: 'A-105',
    dorm: 'สุรนิเวศ 7',
    issue: 'แอร์ไม่เย็น',
    action: 'ล้างแอร์และเติมน้ำยา',
    time: '1 ชม.ที่แล้ว',
    category: 'เครื่องใช้ไฟฟ้า',
    status: 'รอตรวจงาน',
    studentId: 'B670002',
    techName: 'สมชาย ใจดี',
    techPhone: '089-555-7777',
    techAvatar: 'https://i.pravatar.cc/150?u=2',
    note: 'แอร์ฝุ่นเยอะมาก ทำการล้างทำความสะอาดและเติมน้ำยาแอร์เพิ่ม 15 ปอนด์ ทำงานเย็นปกติแล้วครับ',
    cost: '0',
    beforeImage: 'https://i.imgur.com/8Km9tLL.jpg',
    afterImage: null,
  },
];

// เอาแถบ 'เร่งด่วน' ออก
const STATUS_TABS = ['ทั้งหมด', 'รอตรวจงาน', 'กำลังซ่อม', 'เสร็จสิ้น'];

export default function AdminReviewScreen() {
  const [activeTab, setActiveTab] = useState('ทั้งหมด');

  // Pop-up States
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  // Image Viewer States
  const [imageViewer, setImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'ประปา': return { icon: 'water', color: '#0EA5E9', bg: '#E0F2FE' };
      case 'ไฟฟ้า': return { icon: 'flash', color: '#EAB308', bg: '#FEF9C3' };
      case 'เฟอร์นิเจอร์': return { icon: 'bed', color: '#8B5CF6', bg: '#EDE9FE' };
      case 'เครื่องใช้ไฟฟ้า': return { icon: 'tv', color: '#EC4899', bg: '#FCE7F3' };
      default: return { icon: 'build', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const safeCategory = selectedTask?.category || selectedTask?.type || 'ทั่วไป';
  const repairConfig = getCategoryConfig(safeCategory);

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
        
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>ตรวจงาน</Text>
        </View>

        {/* ========================================== */}
        {/* Status Tabs */}
        {/* ========================================== */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ========================================== */}
        {/* Task List (กล่องรายการ) */}
        {/* ========================================== */}
        <View style={styles.listContainer}>
          {REVIEW_TASKS.map((task: any) => {
            const taskCategory = task?.category || task?.type || 'ทั่วไป';
            const taskStatus = task?.status || 'รอดำเนินการ';

            // กรองสถานะ
            if (activeTab !== 'ทั้งหมด' && activeTab !== taskStatus) return null;

            const catConfig = getCategoryConfig(taskCategory);

            return (
              <TouchableOpacity 
                key={task.id} 
                style={styles.ticketCard} 
                activeOpacity={0.7} 
                onPress={() => {
                  setSelectedTask(task);
                  setOpenDetail(true);
                }}
              >
                <View style={[styles.urgencyIndicator, { backgroundColor: catConfig.color }]} />
                <View style={styles.ticketContent}>
                  
                  <View style={styles.ticketHeader}>
                    <Text style={styles.taskIdText}>หมายเลขซ่อม: {task.id}</Text>
                    <View style={styles.reviewBadge}>
                      <Text style={styles.reviewBadgeText}>ตรวจสอบงาน</Text>
                    </View>
                  </View>

                  <Text style={styles.locationTitle}>{task.dorm} ・ ห้อง {task.room}</Text>
                  <Text style={styles.issueTitle} numberOfLines={1}>{task.issue}</Text>
                  
                  <View style={styles.timeRow}>
                    <Text style={styles.timeText}>เสร็จสิ้นเมื่อ {task.time}</Text>
                    <Text style={styles.statusSuccessText}>เสร็จแล้ว</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.ticketFooter}>
                    <View style={[styles.badge, { backgroundColor: catConfig.bg }]}>
                      <Ionicons name={catConfig.icon as any} size={14} color={catConfig.color} />
                      <Text style={[styles.badgeText, { color: catConfig.color }]}>{taskCategory}</Text>
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

      {/* ========================================== */}
      {/* 🟢 MODAL: ตรวจสอบงาน (Pop-up ตาม Format ใหม่) */}
      {/* ========================================== */}
      <Modal visible={openDetail} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.detailBox}>
            
            {/* Header Pop-up */}
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setOpenDetail(false)} style={styles.closeBtn}>
                <Ionicons name="chevron-back" size={26} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.detailTitle}>ตรวจสอบงาน</Text>
              <View style={styles.spacer} />
            </View>

            {selectedTask && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailScrollContent}>
                
                {/* ข้อมูลหมายเลขซ่อม & หมวดหมู่ */}
                <View style={styles.taskInfoHeader}>
                   <View style={[styles.bigIconBox, { backgroundColor: repairConfig.bg }]}>
                      <Ionicons name={repairConfig.icon as any} size={32} color={repairConfig.color} />
                   </View>
                   <View style={styles.taskInfoTextGroup}>
                      <Text style={styles.taskIdPopup}>หมายเลขซ่อม: {selectedTask.id}</Text>
                      <Text style={styles.taskRoomPopup}>เลขห้อง: {selectedTask.room}</Text>
                      <Text style={styles.taskIssuePopup}>{selectedTask.issue}</Text>
                      <View style={styles.notifyTimeRow}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#F28C28" />
                        <Text style={styles.notifyTimeText}>แจ้งเมื่อ: {selectedTask.time}</Text>
                      </View>
                   </View>
                </View>

                <View style={styles.dividerFull} />

                {/* ข้อมูลช่างผู้รับผิดชอบ */}
                <View style={styles.techInfoRow}>
                  <Image source={{ uri: selectedTask.techAvatar }} style={styles.techAvatar} />
                  <View style={styles.techInfoTextGroup}>
                    <Text style={styles.techNameTitle}>ช่าง: {selectedTask.techName}</Text>
                    <Text style={styles.techPhoneText}>เบอร์ติดต่อ {selectedTask.techPhone}</Text>
                  </View>
                </View>

                {/* สถานที่ และ หมวดหมู่ */}
                <View style={styles.locationCategoryRow}>
                  <Ionicons name="home-outline" size={16} color="#6B7280" />
                  <Text style={styles.locCatText}>{selectedTask.dorm} / {selectedTask.room}</Text>
                  <Text style={styles.locCatDivider}>|</Text>
                  <Ionicons name="build-outline" size={16} color="#6B7280" />
                  <Text style={styles.locCatText}>ระบบ{safeCategory}</Text>
                </View>

                <View style={styles.actionRow}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.locCatText}>{selectedTask.action}</Text>
                </View>

                {/* รูปภาพ ก่อนทำ-หลังทำ */}
                <View style={styles.imageComparisonContainer}>
                  <View style={styles.imageBox}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { if(selectedTask.beforeImage) { setSelectedImage(selectedTask.beforeImage); setImageViewer(true); } }}>
                      {selectedTask.beforeImage ? (
                        <Image source={{ uri: selectedTask.beforeImage }} style={styles.compareImage} />
                      ) : (
                        <View style={styles.compareImagePlaceholder}>
                          <Ionicons name="image-outline" size={32} color="#D1D5DB" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={styles.imageLabel}>ก่อนทำ</Text>
                  </View>

                  <View style={styles.imageBox}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { if(selectedTask.afterImage) { setSelectedImage(selectedTask.afterImage); setImageViewer(true); } }}>
                      {selectedTask.afterImage ? (
                        <Image source={{ uri: selectedTask.afterImage }} style={styles.compareImage} />
                      ) : (
                        <View style={styles.compareImagePlaceholder}>
                          <Ionicons name="image-outline" size={32} color="#D1D5DB" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={styles.imageLabel}>หลังทำ</Text>
                  </View>
                </View>

                {/* หมายเหตุ */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionBlockTitle}>หมายเหตุ</Text>
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>{selectedTask.note || 'ไม่มีหมายเหตุ'}</Text>
                  </View>
                </View>

                {/* ค่าวัสดุอุปกรณ์ */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionBlockTitle}>ค่าวัสดุอุปกรณ์</Text>
                  <View style={styles.costBox}>
                    <Text style={styles.costText}>{selectedTask.cost ? `${selectedTask.cost} บาท` : 'ไม่มีค่าใช้จ่าย'}</Text>
                  </View>
                </View>

                {/* ปุ่มตกลง (Approve) */}
                <TouchableOpacity 
                  style={styles.approveBtn} 
                  activeOpacity={0.8}
                  onPress={() => {
                    setOpenDetail(false);
                    // TODO: ใส่ฟังก์ชันอัปเดตสถานะใน DB ตรงนี้
                  }}
                >
                  <Text style={styles.approveBtnText}>ตกลง</Text>
                </TouchableOpacity>

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL: ขยายรูปภาพ */}
      {/* ========================================== */}
      <Modal visible={imageViewer} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.imageModalBg} onPress={() => setImageViewer(false)} activeOpacity={1}>
          <TouchableOpacity style={styles.closeImageBtn} onPress={() => setImageViewer(false)}>
             <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
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

  // Tabs
  tabContainer: {
    marginBottom: 16,
  },
  tabScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabBtnActive: {
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

  // Ticket Card (Inspection Style)
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
    marginBottom: 6,
  },
  taskIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  reviewBadge: {
    backgroundColor: '#FEF08A', // สีเหลืองอ่อนตามแบบ
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309', // ตัวอักษรสีน้ำตาลทอง
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusSuccessText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981', // สีเขียวเสร็จแล้ว
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

  // ==========================================
  // Detailed Modal (Inspection Layout)
  // ==========================================
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // ให้ Pop-up ขึ้นมาจากด้านล่างแบบเต็มๆ
  },
  detailBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%', // สูงเกือบเต็มจอ
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  closeBtn: {
    padding: 4,
  },
  spacer: {
    width: 34,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  detailScrollContent: {
    paddingBottom: 30,
  },
  
  // Task Info Header
  taskInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bigIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskInfoTextGroup: {
    flex: 1,
  },
  taskIdPopup: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  taskRoomPopup: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },
  taskIssuePopup: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  notifyTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notifyTimeText: {
    fontSize: 12,
    color: '#F28C28',
    fontWeight: '600',
  },
  dividerFull: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: -20, // ให้เส้นทะลุขอบ
    marginBottom: 20,
  },

  // Tech Info
  techInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  techAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: '#F28C28', // สีส้มเผื่อโหลดรูปไม่ติด
  },
  techInfoTextGroup: {
    flex: 1,
  },
  techNameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  techPhoneText: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Location & Category
  locationCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  locCatText: {
    fontSize: 13,
    color: '#6B7280',
  },
  locCatDivider: {
    color: '#D1D5DB',
    marginHorizontal: 4,
  },

  // Image Comparison
  imageComparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  imageBox: {
    width: '48%',
    alignItems: 'center',
  },
  compareImage: {
    width: '100%',
    aspectRatio: 1, // รูปสี่เหลี่ยมจัตุรัส
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  compareImagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },

  // Sections (Note & Cost)
  sectionBlock: {
    marginBottom: 20,
  },
  sectionBlockTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  noteBox: {
    backgroundColor: '#FFF7ED', // สีส้มอ่อนมาก
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  noteText: {
    fontSize: 14,
    color: '#C2410C', // สีส้มอิฐ
    lineHeight: 22,
  },
  costBox: {
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  costText: {
    fontSize: 15,
    color: '#111827',
  },

  // Approve Button
  approveBtn: {
    backgroundColor: '#D1FAE5', // สีเขียวพาสเทล
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  approveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669', // สีเขียวเข้ม
  },

  // Image Modal
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
});