import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  ActivityIndicator,
  Alert,
} from 'react-native';

// 1. นำเข้า Firebase และ getAuth
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../constants/firebaseConfig'; 

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: 'apps-outline', lib: 'ionic' },
  { id: 'plumbing', label: 'ประปา', icon: 'water-outline', lib: 'ionic' },
  { id: 'electrical', label: 'ไฟฟ้า', icon: 'flash-outline', lib: 'ionic' },
  { id: 'furniture', label: 'เฟอร์นิเจอร์', icon: 'bed-outline', lib: 'ionic' },
  { id: 'appliances', label: 'เครื่องใช้ไฟฟ้า', icon: 'tv-outline', lib: 'ionic' },
];

const SORT_OPTIONS = ['ใหม่ล่าสุด', 'เก่าที่สุด'];

export default function TechDashboardScreen() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('ใหม่ล่าสุด');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  // State สำหรับแจ้งเตือนและข้อมูลผู้ใช้
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    let unsubReports = () => {};
    let unsubUser = () => {};
    let unsubNotif = () => {};

    // 1. ดึงข้อมูลงาน "รอดำเนินการ"
    const qReports = query(collection(db, "Reports"), where("status", "==", "รอดำเนินการ"));
    unsubReports = onSnapshot(qReports, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOption === 'ใหม่ล่าสุด' ? timeB - timeA : timeA - timeB;
      });
      setTasks(sortedData);
      setLoading(false);
    });

    // 2. ดึงสถานะการตั้งค่าจาก Users
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
  }, [sortOption]);

  const handleAcceptJob = async (jobId: string) => {
    Alert.alert("ยืนยันการรับงาน", "คุณต้องการรับใบแจ้งซ่อมนี้เข้าสู่คลังงานของคุณใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      { 
        text: "รับงาน", 
        onPress: async () => {
          try {
            const docRef = doc(db, "Reports", jobId);
            await updateDoc(docRef, {
              status: "กำลังดำเนินการ",
              acceptedAt: new Date().toISOString()
            });
            Alert.alert("สำเร็จ", "รับงานเรียบร้อยแล้ว รายการจะย้ายไปที่เมนูงานของฉัน");
          } catch (error) {
            Alert.alert("ผิดพลาด", "ไม่สามารถรับงานได้");
          }
        }
      }
    ]);
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'ประปา': return { icon: 'water', color: '#3B82F6', bg: '#DBEAFE' }; 
      case 'ไฟฟ้า': return { icon: 'flash', color: '#EAB308', bg: '#FEF9C3' }; 
      case 'เฟอร์นิเจอร์': return { icon: 'bed', color: '#8B5CF6', bg: '#EDE9FE' };
      case 'เครื่องใช้ไฟฟ้า': return { icon: 'tv', color: '#EC4899', bg: '#FCE7F3' };
      default: return { icon: 'build', color: '#F28C28', bg: '#FFF3E8' };
    }
  };

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
        
        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/(technician)/notification' as any)}>
          <Ionicons name="notifications-outline" size={26} color="#111" />
          {userData?.pushEnabled !== false && unreadCount > 0 && (
            <View style={styles.notificationBadge}>
               <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>งานเข้าใหม่</Text>
        </View>

        {/* ตรวจสอบสถานะ isAvailable ถ้าเป็น false ให้โชว์หน้าจอออฟไลน์ */}
        {userData?.isAvailable === false ? (
            <View style={styles.offlineContainer}>
                <Ionicons name="power" size={80} color="#D1D5DB" />
                <Text style={styles.offlineTitle}>คุณกำลังออฟไลน์</Text>
                <Text style={styles.offlineDesc}>
                    คุณได้ปิดสถานะการรับงานไว้ ระบบจึงไม่แสดงรายการแจ้งซ่อมใหม่ หากต้องการเริ่มงาน กรุณาเปิดสถานะที่หน้าการตั้งค่า
                </Text>
                {/* เอาปุ่มไปเปิดสถานะออกเรียบร้อยแล้วครับ */}
            </View>
        ) : (
            // โชว์การ์ดงานและ Filter ตามปกติเมื่อ isAvailable เป็น true หรือ undefined
            <>
                <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryBtn, activeCategory === cat.label && styles.categoryBtnActive]}
                        onPress={() => setActiveCategory(cat.label)}
                    >
                        <Ionicons name={cat.icon as any} size={18} color={activeCategory === cat.label ? '#FFFFFF' : '#6B7280'} />
                        <Text style={[styles.categoryText, activeCategory === cat.label && styles.categoryTextActive]}>{cat.label}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
                </View>

                <View style={styles.sortRow}>
                <Text style={styles.resultText}>
                    พบ {tasks.filter(t => activeCategory === 'ทั้งหมด' || t.category === activeCategory).length} รายการ
                </Text>
                <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
                    <Ionicons name="filter" size={14} color="#6B7280" />
                    <Text style={styles.sortButtonText}>{sortOption}</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#F28C28" style={{ marginTop: 20 }} />
                ) : tasks.filter(t => activeCategory === 'ทั้งหมด' || t.category === activeCategory).length === 0 ? (
                    <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>ไม่มีงานใหม่ในขณะนี้</Text>
                    </View>
                ) : (
                    tasks
                    .filter(t => activeCategory === 'ทั้งหมด' || t.category === activeCategory)
                    .map((task) => {
                        const catConfig = getCategoryConfig(task.category);
                        return (
                        <TouchableOpacity 
                            key={task.id} 
                            style={styles.ticketCard} 
                            activeOpacity={0.8}
                            onPress={() => router.push({ 
                                pathname: '/(technician)/job-request-detail' as any, 
                                params: { id: task.id } 
                            })}
                        >
                            <View style={[styles.urgencyIndicator, { backgroundColor: catConfig.color }]} />
                            <View style={styles.ticketContent}>
                            <View style={styles.ticketHeader}>
                                <View style={[styles.badge, { backgroundColor: catConfig.bg }]}>
                                <Ionicons name={catConfig.icon as any} size={14} color={catConfig.color} />
                                <Text style={[styles.badgeTextCategory, { color: catConfig.color }]}>{task.category}</Text>
                                </View>
                                <Text style={styles.timeText}>
                                {task.createdAt ? new Date(task.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'} น.
                                </Text>
                            </View>

                            <Text style={styles.issueTitle} numberOfLines={1}>{task.title}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={14} color="#9CA3AF" />
                                <Text style={styles.locationText}>{task.dorm} ・ ห้อง {task.room}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.ticketFooter}>
                                <Text style={styles.detailLink}>ดูรายละเอียด</Text>
                                <TouchableOpacity 
                                    style={styles.acceptButton} 
                                    onPress={() => handleAcceptJob(task.id)}
                                >
                                <Text style={styles.acceptButtonText}>กดรับงาน</Text>
                                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                                </TouchableOpacity>
                            </View>
                            </View>
                        </TouchableOpacity>
                        );
                    })
                )}
                </View>
            </>
        )}
      </ScrollView>

      <Modal visible={sortModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เรียงลำดับข้อมูล</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
            </View>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity key={option} style={styles.modalItem} onPress={() => { setSortOption(option); setSortModalVisible(false); }}>
                <Text style={[styles.modalItemText, sortOption === option && { color: '#F28C28', fontWeight: '700' }]}>{option}</Text>
                {sortOption === option && <Ionicons name="checkmark-circle" size={20} color="#F28C28" />}
              </TouchableOpacity>
            ))}
          </View>
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
  appSubtitle: { fontSize: 11, fontWeight: '600', color: '#F28C28' },
  
  notificationBtn: { padding: 8, position: 'relative' },
  notificationBadge: { position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, backgroundColor: '#EF4444', borderRadius: 9, borderWidth: 1.5, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

  scrollContent: { paddingBottom: 40 },
  pageHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  
  // Styles สำหรับหน้าออฟไลน์
  offlineContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 20 },
  offlineTitle: { fontSize: 20, fontWeight: '800', color: '#374151', marginTop: 16 },
  offlineDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, lineHeight: 22 },

  categoryContainer: { marginBottom: 16 },
  categoryScroll: { paddingHorizontal: 20, gap: 10 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', gap: 6 },
  categoryBtnActive: { backgroundColor: '#F28C28', borderColor: '#E67E22' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  categoryTextActive: { color: '#FFFFFF' },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  resultText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  sortButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', gap: 6 },
  sortButtonText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  listContainer: { paddingHorizontal: 20 },
  ticketCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  urgencyIndicator: { width: 6 },
  ticketContent: { flex: 1, padding: 16 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 4 },
  badgeTextCategory: { fontSize: 12, fontWeight: '700' },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  issueTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, color: '#4B5563' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLink: { color: '#6B7280', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
  acceptButton: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  acceptButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#9CA3AF', marginTop: 10, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalItemText: { fontSize: 16, color: '#4B5563' },
});