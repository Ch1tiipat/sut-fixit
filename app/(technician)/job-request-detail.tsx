import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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

// ✅ เชื่อมต่อ Firebase
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig'; 

export default function JobRequestDetailScreen() {
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "Reports", id as string);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setJob({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const handleAcceptJob = async () => {
    Alert.alert("ยืนยันการรับงาน", "คุณต้องการรับงานนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      { 
        text: "รับงาน", 
        onPress: async () => {
          try {
            setIsSubmitting(true);
            const docRef = doc(db, "Reports", id as string);
            await updateDoc(docRef, {
              status: "กำลังดำเนินการ",
              acceptedAt: new Date().toISOString()
            });
            router.replace('/(technician)/(tabs)/tasks'); // ย้ายไปหน้างานของฉัน
          } catch (error) {
            Alert.alert("ผิดพลาด", "ไม่สามารถรับงานได้");
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#F28C28" /></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#F28C28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายละเอียดคำร้องใหม่</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* การแจ้งเตือนด้านบน */}
        <View style={styles.alertBox}>
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text style={styles.alertText}>โปรดตรวจสอบรายละเอียดและกดรับงานเพื่อดำเนินการ</Text>
        </View>

        {/* บัตรข้อมูลสถานที่ */}
        <View style={styles.infoCard}>
          <View style={styles.locationRow}>
             <View style={styles.locationIcon}><Ionicons name="location" size={24} color="#F28C28" /></View>
             <View>
                <Text style={styles.locationLabel}>สถานที่</Text>
                <Text style={styles.locationValue}>สุรนิเวศ {job?.dorm} ・ ห้อง {job?.room}</Text>
             </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>รหัสคำร้อง</Text>
            <Text style={styles.detailValue}>#{job?.id?.substring(0, 8).toUpperCase()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>หมวดหมู่</Text>
            <View style={styles.categoryBadge}><Text style={styles.categoryText}>{job?.category}</Text></View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>เวลาที่แจ้ง</Text>
            <Text style={styles.detailValue}>
              {job?.createdAt ? new Date(job.createdAt).toLocaleString('th-TH') : '-'}
            </Text>
          </View>
        </View>

        {/* รายละเอียดปัญหา */}
        <Text style={styles.sectionTitle}>รายละเอียดปัญหา</Text>
        <View style={styles.problemBox}>
          <Text style={styles.problemText}>"{job?.title || 'ไม่ได้ระบุรายละเอียด'}"</Text>
        </View>

        {/* ✅ ส่วนที่แก้ไข: แสดงรูปภาพประกอบแบบครบถ้วน (Grid) */}
        <Text style={styles.sectionTitle}>ภาพประกอบ</Text>
        {job?.images && job.images.length > 0 ? (
          <View style={styles.imageGrid}>
            {job.images.map((uri: string, idx: number) => (
              <Image key={idx} source={{ uri }} style={styles.gridImage} resizeMode="cover" />
            ))}
          </View>
        ) : (
          <View style={styles.noImageBox}>
            <Ionicons name="image-outline" size={40} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', marginTop: 8 }}>ไม่มีภาพประกอบ</Text>
          </View>
        )}

      </ScrollView>

      {/* ปุ่มกดรับงานด้านล่าง */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backFooterBtn} onPress={() => router.back()}>
          <Text style={styles.backFooterText}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.acceptBtn, isSubmitting && { opacity: 0.7 }]} 
          onPress={handleAcceptJob}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#FFF" /> : (
            <>
              <Ionicons name="hammer" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.acceptBtnText}>รับงานนี้</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  alertBox: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, marginTop: 16, alignItems: 'center', gap: 8 },
  alertText: { flex: 1, color: '#B91C1C', fontSize: 12, fontWeight: '600' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginTop: 20, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locationIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center' },
  locationLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  locationValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  categoryBadge: { backgroundColor: '#FEF9C3', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: '#CA8A04', fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 24, marginBottom: 16 },
  problemBox: { backgroundColor: '#F9FAFB', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  problemText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  
  // ✅ Image Grid Styles
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridImage: { width: '48%', height: 160, borderRadius: 16, marginBottom: 12, backgroundColor: '#F3F4F6' },
  noImageBox: { width: '100%', height: 160, borderRadius: 16, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 12 },
  backFooterBtn: { flex: 1, height: 56, backgroundColor: '#F3F4F6', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  backFooterText: { fontSize: 16, fontWeight: '700', color: '#4B5563' },
  acceptBtn: { flex: 2, height: 56, backgroundColor: '#F28C28', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  acceptBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});