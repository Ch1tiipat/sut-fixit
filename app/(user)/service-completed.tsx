import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ==========================================
// Main Screen: ServiceCompletedScreen
// ==========================================
export default function ServiceCompletedScreen() {
  const [comment, setComment] = useState('');
  
  // State สำหรับจัดการดาว (จำลองการกดให้คะแนน)
  const [satisfactionScore, setSatisfactionScore] = useState(4);
  const [speedScore, setSpeedScore] = useState(5);

  const renderStars = (score: number, setScore: (val: number) => void) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setScore(star)} activeOpacity={0.7}>
            <Ionicons 
              name={star <= score ? "star" : "star-outline"} 
              size={28} // ขยายดาวให้กดง่ายขึ้น
              color={star <= score ? "#F28C28" : "#D1D5DB"} 
              style={{ marginRight: 6 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ========================================== */}
        {/* Header Bar (ปรับให้เข้าเซ็ตกับหน้าอื่นๆ)         */}
        {/* ========================================== */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#F28C28" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>รายละเอียดแจ้งซ่อมแซม</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* ========================================== */}
          {/* Section: สถานะ */}
          {/* ========================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>สถานะปัจจุบัน</Text>
            
            <View style={styles.statusCard}>
              <View style={styles.statusLeft}>
                <View style={styles.statusIconCircle}>
                  <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.statusMainText}>ซ่อมแซมเสร็จสิ้น</Text>
                  <Text style={styles.statusDateText}>อัปเดตเมื่อ 24 ต.ค. 2568</Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>เสร็จสมบูรณ์</Text>
              </View>
            </View>
          </View>

          {/* ========================================== */}
          {/* Section: ข้อมูลการซ่อมแซม */}
          {/* ========================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ข้อมูลการซ่อมแซม</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>หมายเลขงาน</Text>
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
              
              {/* Note Box */}
              <View style={styles.noteBox}>
                <MaterialCommunityIcons name="comment-quote-outline" size={20} color="#F28C28" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.noteText}>
                  “ช่างไฟฟ้าได้ทำการตรวจสอบและเปลี่ยนหลอดไฟใหม่เรียบร้อยแล้ว ระบบกลับมาใช้งานได้ตามปกติ”
                </Text>
              </View>
            </View>
          </View>

          {/* ========================================== */}
          {/* Section: รูปภาพหลังซ่อม */}
          {/* ========================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ภาพถ่ายหลังดำเนินการ</Text>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
              }}
              style={styles.serviceImage}
            />
          </View>

          {/* ========================================== */}
          {/* Section: ประเมินบริการ */}
          {/* ========================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ประเมินความพึงพอใจ</Text>

            <View style={styles.evaluationCard}>
              
              {/* ความพึงพอใจ */}
              <View style={styles.ratingBlock}>
                <View style={styles.ratingHeaderRow}>
                  <Text style={styles.ratingLabel}>คุณภาพการซ่อมแซม</Text>
                  <Text style={styles.ratingScore}>{satisfactionScore}.0</Text>
                </View>
                <Text style={styles.ratingSubText}>กรุณาให้คะแนน 1 - 5 ดาว</Text>
                {renderStars(satisfactionScore, setSatisfactionScore)}
              </View>

              <View style={styles.divider} />

              {/* ความรวดเร็ว */}
              <View style={styles.ratingBlock}>
                <View style={styles.ratingHeaderRow}>
                  <Text style={styles.ratingLabel}>ความรวดเร็วในการบริการ</Text>
                  <Text style={styles.ratingScore}>{speedScore}.0</Text>
                </View>
                <Text style={styles.ratingSubText}>กรุณาให้คะแนน 1 - 5 ดาว</Text>
                {renderStars(speedScore, setSpeedScore)}
              </View>

              <View style={styles.divider} />

              {/* ข้อเสนอแนะ */}
              <View style={styles.commentHeaderRow}>
                <Text style={styles.commentTitle}>ข้อเสนอแนะเพิ่มเติม</Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>Optional</Text>
                </View>
              </View>
              <TextInput
                style={styles.commentBox}
                multiline
                textAlignVertical="top"
                placeholder="บอกเล่าความประทับใจ หรือข้อเสนอแนะเพื่อพัฒนา..."
                placeholderTextColor="#9CA3AF"
                value={comment}
                onChangeText={setComment}
              />

            </View>
          </View>

          {/* ========================================== */}
          {/* Submit Button */}
          {/* ========================================== */}
          <TouchableOpacity 
            style={styles.confirmButton} 
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Text style={styles.confirmButtonText}>ส่งแบบประเมิน</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const ORANGE = '#F28C28';
const DARK_TEXT = '#111827';
const GRAY_TEXT = '#6B7280';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  headerRight: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 12,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  statusDateText: {
    fontSize: 13,
    color: GRAY_TEXT,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: GRAY_TEXT,
  },
  infoValue: {
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  noteBox: {
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: '#FFF8F1', 
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#B45309', 
    lineHeight: 22,
    fontStyle: 'italic',
  },
  serviceImage: {
    width: '100%',
    height: 200, 
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  evaluationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ratingBlock: {
    marginBottom: 8,
  },
  ratingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  ratingScore: {
    fontSize: 22,
    fontWeight: '800',
    color: ORANGE,
  },
  ratingSubText: {
    fontSize: 13,
    color: GRAY_TEXT,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  commentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  newBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  commentBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 15,
    color: DARK_TEXT,
  },
  confirmButton: {
    marginTop: 30,
    marginHorizontal: 20,
    height: 56, 
    backgroundColor: ORANGE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});