import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  FlatList, Image, Modal, Platform, SafeAreaView, ScrollView, 
  StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert,
} from 'react-native';

// ➕ นำเข้า MapView
import MapView, { Marker, Callout } from 'react-native-maps';

import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../constants/firebaseConfig'; 

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: 'apps-outline' },
  { id: 'plumbing', label: 'ประปา', icon: 'water-outline' },
  { id: 'electrical', label: 'ไฟฟ้า', icon: 'flash-outline' },
  { id: 'furniture', label: 'เฟอร์นิเจอร์', icon: 'bed-outline' },
  { id: 'appliances', label: 'เครื่องใช้ไฟฟ้า', icon: 'tv-outline' },
];

const SORT_OPTIONS = ['ใหม่ล่าสุด', 'เก่าที่สุด'];

// 🎯 ข้อมูลพิกัดหอพักสุรนิเวศ 1-17 (พิกัดจำลอง)
const DORM_COORDINATES: Record<string, { lat: number, lng: number }> = {
    "สุรนิเวศ 1": { lat: 14.89527, lng: 102.0151836 },
    "สุรนิเวศ 2": { lat: 14.8960784, lng: 102.0148626 },
    "สุรนิเวศ 3": { lat: 14.896500, lng: 102.014500 },
    "สุรนิเวศ 4": { lat: 14.8970095, lng: 102.0137376 },
    "สุรนิเวศ 5": { lat: 14.897500, lng: 102.013000 },
    "สุรนิเวศ 6": { lat: 14.898000, lng: 102.012500 },
    "สุรนิเวศ 7": { lat: 14.895500, lng: 102.011500 },
    "สุรนิเวศ 8": { lat: 14.8965027, lng: 102.0108475 },
    "สุรนิเวศ 9": { lat: 14.897500, lng: 102.010000 },
    "สุรนิเวศ 10": { lat: 14.898500, lng: 102.009500 },
    "สุรนิเวศ 11": { lat: 14.891000, lng: 102.016000 },
    "สุรนิเวศ 12": { lat: 14.891500, lng: 102.015500 },
    "สุรนิเวศ 13": { lat: 14.890500, lng: 102.015000 },
    "สุรนิเวศ 14": { lat: 14.890000, lng: 102.014500 },
    "สุรนิเวศ 15": { lat: 14.891500, lng: 102.014000 },
    "สุรนิเวศ 16": { lat: 14.892243, lng: 102.0144115 },
    "สุรนิเวศ 17": { lat: 14.893000, lng: 102.013500 },
};

const formatThaiDateTime = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${d} ${m} ${y} เวลา ${hours}:${minutes} น.`;
};

export default function TechDashboardScreen() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('ใหม่ล่าสุด');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  
  // State สำหรับสลับโหมด (list หรือ map)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    let unsubReports = () => {};
    let unsubUser = () => {};
    let unsubNotif = () => {};

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

    unsubUser = onSnapshot(doc(db, "Users", user.uid), (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
    });

    const qNotif = query(collection(db, "Notifications"), where("targetUid", "==", user.uid), where("isRead", "==", false));
    unsubNotif = onSnapshot(qNotif, (snapshot) => { setUnreadCount(snapshot.size); });

    return () => { unsubReports(); unsubUser(); unsubNotif(); };
  }, [sortOption]);

  const handleAcceptJob = async (jobId: string) => {
    Alert.alert("ยืนยันการรับงาน", "รับใบแจ้งซ่อมนี้เข้าสู่คลังงานของคุณใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      { 
        text: "รับงาน", 
        onPress: async () => {
          try {
            const docRef = doc(db, "Reports", jobId);
            await updateDoc(docRef, { status: "กำลังดำเนินการ", acceptedAt: new Date().toISOString() });
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

  const filteredTasks = tasks.filter(t => activeCategory === 'ทั้งหมด' || t.category === activeCategory);

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
            <View style={styles.notificationBadge}><Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>งานเข้าใหม่</Text>
        </View>

        {userData?.isAvailable === false ? (
            <View style={styles.offlineContainer}>
                <Ionicons name="power" size={80} color="#D1D5DB" />
                <Text style={styles.offlineTitle}>คุณกำลังออฟไลน์</Text>
                <Text style={styles.offlineDesc}>คุณได้ปิดสถานะการรับงานไว้ ระบบจึงไม่แสดงรายการแจ้งซ่อมใหม่ หากต้องการเริ่มงาน กรุณาเปิดสถานะที่หน้าการตั้งค่า</Text>
            </View>
        ) : (
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
                  <Text style={styles.resultText}>พบ {filteredTasks.length} รายการ</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.sortButton} onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}>
                        <Ionicons name={viewMode === 'list' ? "map" : "list"} size={14} color="#6B7280" />
                        <Text style={styles.sortButtonText}>{viewMode === 'list' ? 'ดูแผนที่' : 'ดูรายการ'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
                        <Ionicons name="filter" size={14} color="#6B7280" />
                        <Text style={styles.sortButtonText}>{sortOption}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F28C28" style={{ marginTop: 20 }} />
                ) : filteredTasks.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                      <Text style={styles.emptyText}>ไม่มีงานใหม่ในขณะนี้</Text>
                    </View>
                ) : viewMode === 'map' ? (
                    <View style={styles.mapCard}>
                      <MapView 
                        style={styles.mapFullscreen}
                        initialRegion={{
                          latitude: 14.8940,
                          longitude: 102.0135,
                          latitudeDelta: 0.015,
                          longitudeDelta: 0.015,
                        }}
                      >
                        {filteredTasks.map(task => {
                          const coords = task.locationCoords || DORM_COORDINATES[task.dorm];
                          if (!coords) return null;
                          const catConfig = getCategoryConfig(task.category);
                          return (
                            <Marker key={task.id} coordinate={{ latitude: coords.lat, longitude: coords.lng }}>
                              <View style={[styles.customMarker, { backgroundColor: catConfig.color }]}>
                                <Ionicons name={catConfig.icon as any} size={14} color="#FFF" />
                              </View>
                              <Callout onPress={() => router.push({ pathname: '/(technician)/job-request-detail', params: { id: task.id } } as any)}>
                                <View style={styles.calloutBox}>
                                  <Text style={styles.calloutTitle}>{task.dorm} ห้อง {task.room}</Text>
                                  <Text style={styles.calloutDesc} numberOfLines={2}>{task.title}</Text>
                                  <Text style={styles.calloutLink}>แตะเพื่อดูรายละเอียด ➡</Text>
                                </View>
                              </Callout>
                            </Marker>
                          )
                        })}
                      </MapView>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                      {filteredTasks.map((task) => {
                          const catConfig = getCategoryConfig(task.category);
                          return (
                          <TouchableOpacity 
                              key={task.id} 
                              style={styles.ticketCard} 
                              activeOpacity={0.8}
                              onPress={() => router.push({ pathname: '/(technician)/job-request-detail', params: { id: task.id } } as any)}
                          >
                              <View style={[styles.urgencyIndicator, { backgroundColor: catConfig.color }]} />
                              
                              <View style={styles.ticketContent}>
                                <View style={styles.ticketHeader}>
                                    <View style={[styles.badge, { backgroundColor: catConfig.bg }]}>
                                      <Ionicons name={catConfig.icon as any} size={14} color={catConfig.color} />
                                      <Text style={[styles.badgeTextCategory, { color: catConfig.color }]}>{task.category}</Text>
                                    </View>
                                    <Text style={styles.timeText}>{task.createdAt ? formatThaiDateTime(task.createdAt) : '-'}</Text>
                                </View>

                                {/* 📸 ส่วนที่เพิ่มใหม่: โชว์รูปภาพที่นักศึกษาอัปโหลดมา */}
                                <View style={styles.previewRow}>
                                  {task.images && task.images.length > 0 ? (
                                    <Image source={{ uri: task.images[0] }} style={styles.thumbnailImage} resizeMode="cover" />
                                  ) : (
                                    <View style={styles.placeholderImage}>
                                      <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                                    </View>
                                  )}
                                  
                                  <View style={styles.infoCol}>
                                    <Text style={styles.issueTitle} numberOfLines={2}>{task.title}</Text>
                                    <View style={styles.locationRow}>
                                        <Ionicons name="location" size={14} color="#9CA3AF" />
                                        <Text style={styles.locationText}>{task.dorm} ・ ห้อง {task.room}</Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.divider} />
                                
                                <View style={styles.ticketFooter}>
                                    <Text style={styles.detailLink}>ดูรายละเอียด</Text>
                                    <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptJob(task.id)}>
                                      <Text style={styles.acceptButtonText}>กดรับงาน</Text>
                                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>
                                </View>
                              </View>
                          </TouchableOpacity>
                          );
                      })}
                    </View>
                )}
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
  mapCard: { height: 450, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', marginHorizontal: 20, marginBottom: 20 },
  mapFullscreen: { flex: 1 },
  customMarker: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  calloutBox: { padding: 8, minWidth: 150 },
  calloutTitle: { fontWeight: '800', fontSize: 14, color: '#111827' },
  calloutDesc: { fontSize: 12, color: '#4B5563', marginVertical: 4 },
  calloutLink: { fontSize: 12, color: '#10B981', fontWeight: '700', marginTop: 4 },
  listContainer: { paddingHorizontal: 20 },
  ticketCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  urgencyIndicator: { width: 6 },
  ticketContent: { flex: 1, padding: 16 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 4 },
  badgeTextCategory: { fontSize: 12, fontWeight: '700' },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  
  /* 📸 สไตล์สำหรับการแสดงรูปภาพ */
  previewRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  thumbnailImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#F3F4F6' },
  placeholderImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  infoCol: { flex: 1, justifyContent: 'center' },
  
  issueTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 6 },
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