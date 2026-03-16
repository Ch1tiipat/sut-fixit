import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function JobRequestDetailScreen() {
  
  // ฟังก์ชันเมื่อช่างกดรับงาน
  const handleAcceptJob = () => {
    Alert.alert(
      'ยืนยันการรับงาน',
      'เมื่อรับงานแล้ว งานนี้จะย้ายไปที่เมนู "งานของฉัน" เพื่อให้คุณดำเนินการต่อ',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'รับงานเลย', 
          onPress: () => {
            // จำลองว่ารับงานสำเร็จ แล้วเด้งกลับไปหน้าแรก (เดี๋ยวของจริงค่อยเขียน Logic ให้ย้าย Tab)
            Alert.alert('สำเร็จ', 'รับงานเรียบร้อยแล้ว!', [
              { text: 'ตกลง', onPress: () => router.back() }
            ]);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#F28C28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายละเอียดคำร้องใหม่</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ========================================== */}
        {/* Banner แจ้งเตือนความเร่งด่วน */}
        {/* ========================================== */}
        <View style={styles.urgentBanner}>
          <Ionicons name="alert-circle" size={24} color="#EF4444" />
          <View style={styles.urgentTextContainer}>
            <Text style={styles.urgentTitle}>งานเร่งด่วน!</Text>
            <Text style={styles.urgentSub}>ผู้แจ้งระบุว่าปัญหานี้ส่งผลกระทบต่อการอยู่อาศัย</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* ข้อมูลสถานที่เกิดเหตุ */}
        {/* ========================================== */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={20} color="#F28C28" />
            </View>
            <View>
              <Text style={styles.locationLabel}>สถานที่</Text>
              <Text style={styles.locationValue}>หอพัก 1 ・ ห้อง B-402</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>รหัสคำร้อง</Text>
            <Text style={styles.infoValue}>#SUT-8829</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>หมวดหมู่</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>ระบบประปา</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>เวลาที่แจ้ง</Text>
            <Text style={styles.infoValue}>วันนี้, 10:30 น.</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* รายละเอียดปัญหา */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>รายละเอียดปัญหา</Text>
        <View style={styles.problemBox}>
          <Text style={styles.problemText}>
            "ท่อน้ำใต้อ่างล้างหน้าในห้องน้ำรั่วซึม มีน้ำไหลเจิ่งนองเต็มพื้นห้องน้ำ รบกวนช่างเข้ามาดูให้หน่อยครับ"
          </Text>
        </View>

        {/* ========================================== */}
        {/* ภาพประกอบ */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>ภาพประกอบ</Text>
        <View style={styles.imageGallery}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300' }} 
            style={styles.attachedImage} 
          />
        </View>

        <View style={{ height: 20 }} />

      </ScrollView>

      {/* ========================================== */}
      {/* Bottom Action (ปุ่มกดรับงาน) */}
      {/* ========================================== */}
      <View style={styles.bottomActionRow}>
        <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.rejectBtnText}>ข้ามงานนี้</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={handleAcceptJob}>
          <Ionicons name="hammer" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.acceptBtnText}>รับงานนี้</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const DARK_TEXT = '#111827';
const GRAY_TEXT = '#6B7280';
const ORANGE = '#F28C28';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  
  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK_TEXT },
  headerRight: { width: 44 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },

  urgentBanner: {
    flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#FECACA', marginBottom: 20, alignItems: 'center'
  },
  urgentTextContainer: { marginLeft: 12, flex: 1 },
  urgentTitle: { fontSize: 16, fontWeight: '800', color: '#B91C1C', marginBottom: 2 },
  urgentSub: { fontSize: 13, color: '#991B1B' },

  locationCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  locationHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF3E8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  locationLabel: { fontSize: 12, color: GRAY_TEXT, marginBottom: 2 },
  locationValue: { fontSize: 16, fontWeight: '800', color: DARK_TEXT },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: GRAY_TEXT, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700', color: DARK_TEXT },
  categoryBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  categoryBadgeText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK_TEXT, marginBottom: 12, marginLeft: 4 },
  
  problemBox: { backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  problemText: { fontSize: 15, color: '#4B5563', lineHeight: 24, fontStyle: 'italic' },

  imageGallery: { flexDirection: 'row', gap: 12 },
  attachedImage: { width: 120, height: 120, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },

  bottomActionRow: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB',
  },
  rejectBtn: { flex: 0.35, height: 56, backgroundColor: '#F3F4F6', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { color: '#4B5563', fontSize: 16, fontWeight: '700' },
  acceptBtn: { flex: 0.65, flexDirection: 'row', height: 56, backgroundColor: ORANGE, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  acceptBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});