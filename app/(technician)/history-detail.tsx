import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HistoryDetailScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#F28C28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายละเอียดงาน (เสร็จสิ้น)</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ========================================== */}
        {/* ส่วนแสดงสถานะและวันที่ */}
        {/* ========================================== */}
        <View style={styles.statusBanner}>
          <Ionicons name="checkmark-circle" size={28} color="#10B981" />
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusMainText}>งานนี้เสร็จสมบูรณ์แล้ว</Text>
            <Text style={styles.statusSubText}>ดำเนินการเสร็จเมื่อ 24 ต.ค. 2568, 15:30 น.</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* รายละเอียดการซ่อม (Task Info) */}
        {/* ========================================== */}
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>หมายเลขแจ้งซ่อม</Text>
            <Text style={styles.infoValue}>#SUT-8829</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ประเภทงาน</Text>
            <Text style={styles.infoValue}>ระบบไฟฟ้า</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>สถานที่</Text>
            <Text style={styles.infoValue}>หอพัก 2, ห้อง 304</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผู้แจ้ง (เบอร์โทร)</Text>
            <Text style={styles.infoValue}>064-622-4562</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* ภาพถ่ายการปฏิบัติงาน (Before & After) */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>ภาพถ่ายก่อนและหลังการซ่อม</Text>
        <View style={styles.imageGallery}>
          <View style={styles.imageBlock}>
            <Text style={styles.imageLabel}>ก่อนซ่อม (Before)</Text>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300' }} style={styles.historyImage} />
          </View>
          <View style={styles.imageBlock}>
            <Text style={styles.imageLabel}>หลังซ่อม (After)</Text>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=300' }} style={styles.historyImage} />
          </View>
        </View>

        {/* ========================================== */}
        {/* บันทึกจากช่าง (Read-only Text Box) */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>บันทึกรายละเอียดการทำงาน</Text>
        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>
            ช่างได้เข้าตรวจสอบพบว่าบัลลาสต์เสื่อมสภาพ จึงได้ทำการเปลี่ยนบัลลาสต์และหลอดไฟใหม่เรียบร้อยแล้ว ทดสอบระบบไฟใช้งานได้ปกติ
          </Text>
        </View>

        {/* ========================================== */}
        {/* สรุปค่าใช้จ่าย */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>สรุปค่าใช้จ่าย</Text>
        <View style={styles.costBox}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>ค่าวัสดุอุปกรณ์</Text>
            <Text style={styles.costValue}>100.00 บาท</Text>
          </View>
          <View style={[styles.costRow, { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, marginTop: 12 }]}>
            <Text style={styles.totalLabel}>ยอดรวมสุทธิ</Text>
            <Text style={styles.totalValue}>100.00 บาท</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const DARK_TEXT = '#111827';
const GRAY_TEXT = '#6B7280';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // Header
  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK_TEXT },
  headerRight: { width: 44 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },

  // Status Banner
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5',
    padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#A7F3D0'
  },
  statusTextContainer: { marginLeft: 12, flex: 1 },
  statusMainText: { fontSize: 16, fontWeight: '800', color: '#065F46', marginBottom: 2 },
  statusSubText: { fontSize: 13, color: '#047857' },

  // Info Block
  infoBlock: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: 14, color: GRAY_TEXT, fontWeight: '500' },
  infoValue: { fontSize: 15, fontWeight: '700', color: DARK_TEXT },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK_TEXT, marginBottom: 12, marginLeft: 4 },

  // Images
  imageGallery: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  imageBlock: { flex: 1, alignItems: 'center' },
  imageLabel: { fontSize: 13, fontWeight: '600', color: GRAY_TEXT, marginBottom: 8 },
  historyImage: { width: '90%', height: 120, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },

  // Read-only Box
  readOnlyBox: {
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, padding: 16, marginBottom: 24,
  },
  readOnlyText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },

  // Cost Box
  costBox: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costLabel: { fontSize: 15, color: GRAY_TEXT },
  costValue: { fontSize: 15, fontWeight: '600', color: DARK_TEXT },
  totalLabel: { fontSize: 16, fontWeight: '800', color: DARK_TEXT },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#EF4444' },
});