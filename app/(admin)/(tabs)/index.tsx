import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
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
  ActivityIndicator
} from 'react-native';

// ✅ 1. นำเข้า Firebase และ getAuth เพิ่มเติม
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../constants/firebaseConfig'; 

const STATUS_TABS = ['ทั้งหมด', 'รอดำเนินการ', 'กำลังซ่อม', 'เสร็จสิ้น'];
const DATE_OPTIONS = ['ทั้งหมด', 'วันนี้', 'เมื่อวาน'];
const CATEGORY_OPTIONS = ['ทั้งหมด', 'ประปา', 'ไฟฟ้า', 'เฟอร์นิเจอร์', 'เครื่องใช้ไฟฟ้า', 'อื่นๆ'];
const FEMALE_DORMS = ['สุรนิเวศ 1', 'สุรนิเวศ 2', 'สุรนิเวศ 3', 'สุรนิเวศ 4', 'สุรนิเวศ 5', 'สุรนิเวศ 14', 'สุรนิเวศ 15'];
const MALE_DORMS = ['สุรนิเวศ 7', 'สุรนิเวศ 8', 'สุรนิเวศ 9', 'สุรนิเวศ 13', 'สุรนิเวศ 17'];

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedDate, setSelectedDate] = useState('ทั้งหมด');
  const [selectedDorm, setSelectedDorm] = useState('ทั้งหมด');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<'date' | 'dorm' | 'category'>('date');

  // Detail Pop-up States
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [reporterInfo, setReporterInfo] = useState<any>(null); 
  
  const [imageViewer, setImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ เพิ่ม State สำหรับแจ้งเตือนและข้อมูลแอดมิน
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    let unsubReports = () => {};
    let unsubUser = () => {};
    let unsubNotif = () => {};

    // 1. ดึงข้อมูลงานทั้งหมด
    const qReports = query(collection(db, "Reports"));
    unsubReports = onSnapshot(qReports, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
      });
      setTasks(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    // 2. ดึงสถานะการตั้งค่าของ Admin
    unsubUser = onSnapshot(doc(db, "Users", user.uid), (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
    });

    // 3. ดึงจำนวนแจ้งเตือนที่ยังไม่ได้อ่าน
    const qNotif = query(
      collection(db, "Notifications"),
      where("targetUid", "==", user.uid),
      where("isRead", "==", false)
    );
    unsubNotif = onSnapshot(qNotif, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => { unsubReports(); unsubUser(); unsubNotif(); };
  }, []);

  const handleOpenDetail = async (task: any) => {
    setSelectedRepair(task);
    setOpenDetail(true);
    setReporterInfo(null); 

    const uid = task.userId || task.uid;

    if (uid) {
      try {
        const userRef = doc(db, "Users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setReporterInfo(userSnap.data());
        } else {
          setReporterInfo({ 
            fullName: task.fullName || task.name || "ไม่ระบุชื่อ", 
            studentId: task.studentId || "-" 
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setReporterInfo({ fullName: "เกิดข้อผิดพลาดในการโหลด" });
      }
    } else {
      setReporterInfo({ 
        fullName: task.fullName || task.name || "ไม่ระบุชื่อ",
        studentId: task.studentId || "-"
      });
    }
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

  const handleSelectFilter = (item: string) => {
    if (filterType === 'date') setSelectedDate(item);
    if (filterType === 'dorm') setSelectedDorm(item);
    if (filterType === 'category') setSelectedCategory(item);
    setFilterModalVisible(false);
  };

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    let matchStatus = activeTab === 'ทั้งหมด';
    if (activeTab === 'รอดำเนินการ') matchStatus = task.status === 'รอดำเนินการ';
    if (activeTab === 'กำลังซ่อม') matchStatus = (task.status === 'กำลังดำเนินการ' || task.status === 'กำลังซ่อม');
    if (activeTab === 'เสร็จสิ้น') matchStatus = (task.status === 'เสร็จสิ้น' || task.status === 'เสร็จสมบูรณ์');

    const matchCat = selectedCategory === 'ทั้งหมด' || task.category === selectedCategory;
    const matchDorm = selectedDorm === 'ทั้งหมด' || task.dorm === selectedDorm;
    return matchStatus && matchCat && matchDorm;
  }) : [];

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

        {/* ✅ ปรับปรุงกระดิ่งให้มีตัวเลขแจ้งเตือน */}
        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/(admin)/notifications' as any)}>
          <Ionicons name="notifications-outline" size={26} color="#111" />
          {userData?.pushEnabled !== false && unreadCount > 0 && (
            <View style={styles.notificationBadge}>
               <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}><Text style={styles.pageTitle}>จัดการคำร้องแจ้งซ่อม</Text></View>

        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {STATUS_TABS.map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterRow}>
          {['date', 'dorm', 'category'].map((type: any) => (
            <TouchableOpacity key={type} style={styles.filterDropdown} onPress={() => {setFilterType(type); setFilterModalVisible(true);}}>
              <Text style={styles.filterText} numberOfLines={1}>
                {type === 'date' ? selectedDate : type === 'dorm' ? selectedDorm : selectedCategory}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listContainer}>
          {loading ? <ActivityIndicator size="large" color="#F28C28" style={{marginTop: 50}} /> : filteredTasks.map((task) => {
            const config = getCategoryConfig(task.category);
            const statusColor = (task.status === 'เสร็จสิ้น' || task.status === 'เสร็จสมบูรณ์') ? '#10B981' : (task.status === 'กำลังดำเนินการ' || task.status === 'กำลังซ่อม' ? '#3B82F6' : '#F59E0B');
            return (
              <TouchableOpacity key={task.id} style={styles.ticketCard} onPress={() => handleOpenDetail(task)}>
                <View style={[styles.urgencyIndicator, { backgroundColor: config.color }]} />
                <View style={styles.ticketContent}>
                  <View style={styles.ticketHeader}>
                    <View style={[styles.badge, { backgroundColor: config.bg }]}>
                      <Ionicons name={config.icon as any} size={14} color={config.color} />
                      <Text style={[styles.badgeText, { color: config.color }]}>{task.category}</Text>
                    </View>
                    <Text style={styles.timeText}>{task.createdAt ? new Date(task.createdAt).toLocaleDateString('th-TH') : '-'}</Text>
                  </View>
                  <Text style={styles.issueTitle} numberOfLines={1}>{task.title}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#9CA3AF" />
                    <Text style={styles.locationText}>{task.dorm} ・ ห้อง {task.room}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.ticketFooter}>
                    <Text style={[styles.statusText, { color: statusColor }]}>สถานะ: {task.status === 'กำลังดำเนินการ' ? 'กำลังซ่อม' : task.status}</Text>
                    <View style={styles.actionBtn}><Text style={styles.actionText}>ดูรายละเอียด</Text><Ionicons name="arrow-forward" size={16} color="#F28C28" /></View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ✅ Modal แสดงผลชื่อและรหัสนักศึกษาตาม Database */}
      <Modal visible={openDetail} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.detailBox}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setOpenDetail(false)}><Ionicons name="close" size={28} color="#6B7280" /></TouchableOpacity>
              <Text style={styles.detailTitle}>รายละเอียดแจ้งซ่อม</Text>
              <View style={{width: 28}} />
            </View>

            {selectedRepair && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailCategoryRow}>
                  <View style={[styles.badge, { backgroundColor: getCategoryConfig(selectedRepair.category).bg, padding: 8 }]}>
                    <Ionicons name={getCategoryConfig(selectedRepair.category).icon as any} size={16} color={getCategoryConfig(selectedRepair.category).color} />
                    <Text style={[styles.badgeText, { color: getCategoryConfig(selectedRepair.category).color }]}>{selectedRepair.category}</Text>
                  </View>
                  <Text style={{fontWeight:'800', color: (selectedRepair.status === 'เสร็จสิ้น' || selectedRepair.status === 'เสร็จสมบูรณ์') ? '#10B981' : '#F59E0B'}}>
                    {selectedRepair.status === 'กำลังดำเนินการ' ? 'กำลังซ่อม' : selectedRepair.status}
                  </Text>
                </View>

                <Text style={styles.detailIssueTitle}>{selectedRepair.title}</Text>

                <View style={styles.detailInfoBox}>
                  <View style={styles.detailInfoRow}>
                    <Ionicons name="location-outline" size={20} color="#6B7280" />
                    <View style={styles.detailInfoTextGroup}><Text style={styles.detailInfoLabel}>สถานที่</Text><Text style={styles.detailInfoValue}>{selectedRepair.dorm} / {selectedRepair.room}</Text></View>
                  </View>
                  <View style={styles.detailInfoDivider} />
                  
                  {/* ✅ แสดงชื่อผู้แจ้งจริงจาก Database */}
                  <View style={styles.detailInfoRow}>
                    <Ionicons name="person-outline" size={20} color="#6B7280" />
                    <View style={styles.detailInfoTextGroup}>
                        <Text style={styles.detailInfoLabel}>ผู้แจ้ง (ชื่อ-นามสกุล)</Text>
                        <Text style={styles.detailInfoValue}>
                            {reporterInfo ? (reporterInfo.fullName || reporterInfo.name || "ไม่ระบุชื่อ") : "กำลังโหลด..."}
                        </Text>
                    </View>
                  </View>
                  <View style={styles.detailInfoDivider} />

                  {/* ✅ แสดงรหัสนักศึกษาจริงจาก Database */}
                  <View style={styles.detailInfoRow}>
                    <Ionicons name="card-outline" size={20} color="#6B7280" />
                    <View style={styles.detailInfoTextGroup}>
                        <Text style={styles.detailInfoLabel}>รหัสนักศึกษา</Text>
                        <Text style={styles.detailInfoValue}>
                            {reporterInfo ? (reporterInfo.studentId || "-") : "กำลังโหลด..."}
                        </Text>
                    </View>
                  </View>
                  <View style={styles.detailInfoDivider} />

                  <View style={styles.detailInfoRow}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" />
                    <View style={styles.detailInfoTextGroup}>
                      <Text style={styles.detailInfoLabel}>เบอร์โทรศัพท์</Text>
                      <Text style={styles.detailInfoValue}>{reporterInfo?.phone || selectedRepair.phone || '-'}</Text>
                    </View>
                  </View>
                </View>
                
                {selectedRepair.images?.length > 0 && (
                  <View style={{marginTop: 20}}>
                    <Text style={styles.detailSectionTitle}>รูปภาพประกอบ</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 10}}>
                      {selectedRepair.images.map((img: string, i: number) => (
                        <TouchableOpacity key={i} onPress={() => { setSelectedImage(img); setImageViewer(true); }}>
                          <Image source={{ uri: img }} style={styles.galleryImage} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal & Image Viewer คงเดิม */}
      <Modal visible={filterModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlayFilter} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContentFilter}>
            <Text style={styles.modalTitleFilter}>กรุณาเลือก</Text>
            <FlatList
              data={filterType === 'date' ? DATE_OPTIONS : filterType === 'dorm' ? [...FEMALE_DORMS, ...MALE_DORMS] : CATEGORY_OPTIONS}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.modalItemFilter} onPress={() => handleSelectFilter(item)}>
                  <Text style={[styles.modalItemTextFilter, (selectedDorm === item || selectedCategory === item) && {color: '#F28C28'}]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={imageViewer} transparent={true} animationType="fade">
        <TouchableOpacity style={{flex:1, backgroundColor:'rgba(0,0,0,0.9)', justifyContent:'center'}} onPress={() => setImageViewer(false)}>
          <Image source={{ uri: selectedImage || '' }} style={{width:'100%', height:'70%', resizeMode:'contain'}} />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 44, height: 44, borderRadius: 10, marginRight: 12 },
  appName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  appSubtitle: { fontSize: 11, fontWeight: '600', color: '#EF4444', marginTop: 2 },
  
  // ✅ อัปเดตสไตล์กระดิ่งแอดมิน
  notificationBtn: { padding: 8, position: 'relative' },
  notificationBadge: { position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, backgroundColor: '#EF4444', borderRadius: 9, borderWidth: 1.5, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

  scrollContent: { paddingBottom: 40 },
  pageHeader: { padding: 20 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  tabContainer: { marginBottom: 16 },
  tabScroll: { paddingHorizontal: 20, gap: 10 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  tabBtnActive: { backgroundColor: '#F28C28', borderColor: '#E67E22' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 10 },
  filterDropdown: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#4B5563', flex: 1 },
  listContainer: { paddingHorizontal: 20 },
  ticketCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, elevation: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6' },
  urgencyIndicator: { width: 6 },
  ticketContent: { flex: 1, padding: 16 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  issueTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, color: '#4B5563' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { fontSize: 13, fontWeight: '700' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 14, fontWeight: '700', color: '#F28C28' },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  detailBox: { width: "90%", backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, maxHeight: '85%' },
  detailHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  detailTitle: { fontSize: 18, fontWeight: "800" },
  detailCategoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailIssueTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20 },
  detailInfoBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 24 },
  detailInfoRow: { flexDirection: 'row', alignItems: 'center' },
  detailInfoTextGroup: { marginLeft: 12, flex: 1 },
  detailInfoLabel: { fontSize: 11, color: '#6B7280' },
  detailInfoValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  detailInfoDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  galleryImage: { width: 120, height: 120, borderRadius: 12 },
  modalOverlayFilter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContentFilter: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '60%' },
  modalItemFilter: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalItemTextFilter: { fontSize: 16, textAlign: 'center' },
  detailSectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 }
});