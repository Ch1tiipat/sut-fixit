import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const STATS_DATA = {
  totalJobs: 24,
  completed: 18,
  ongoing: 4,
  canceled: 2,
  averageRating: 4.8,
  speedScore: 4.9,
  qualityScore: 4.7,
  ratingDistribution: [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ],
};

const RECENT_REVIEWS = [
  { id: '1', name: 'ไอเเคระ', room: 'สุรนิเวศ 13 - ห้อง 103', rating: 5, comment: 'ดีมากครับ คราวหลังไม่ต้องหยอกเล่นนะครับ ทำดีจริงๆ ช่างพูดจาสุภาพมาก', date: '2 วันที่แล้ว' },
  { id: '2', name: 'มิวสิค เอวพริ้ว', room: 'สุรนิเวศ 14 - ห้อง 304', rating: 3, comment: 'แอร์เย็นแล้วครับ แต่ช่างมาสายไปครึ่งชั่วโมง', date: '1 สัปดาห์ที่แล้ว' },
];

const MONTH_OPTIONS = ['ตุลาคม 2568', 'กันยายน 2568', 'สิงหาคม 2568', 'ภาพรวมทั้งหมด'];

export default function TechStatisticsScreen() {
  const [selectedMonth, setSelectedMonth] = useState('ตุลาคม 2568');
  const [modalVisible, setModalVisible] = useState(false);

  const renderStars = (rating: number, size = 14) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons key={star} name={star <= rating ? 'star' : 'star-outline'} size={size} color={star <= rating ? '#F59E0B' : '#D1D5DB'} />
      ))}
    </View>
  );

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
        <TouchableOpacity 
          style={styles.notificationBtn} 
          activeOpacity={0.7}
          onPress={() => router.push('/(technician)/notification' as any)}
        >
          <Ionicons name="notifications-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeaderRow}>
          <Text style={styles.pageTitle}>สถิติผลงาน</Text>
          <TouchableOpacity style={styles.filterBadge} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
            <Text style={styles.filterText}>{selectedMonth}</Text>
            <Ionicons name="chevron-down" size={14} color="#F28C28" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { width: '100%', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <View style={styles.kpiHeader}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#3B82F6" />
              <Text style={styles.kpiTitle}>งานทั้งหมดที่ได้รับ</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#1D4ED8' }]}>{STATS_DATA.totalJobs}</Text>
          </View>

          <View style={[styles.kpiCard, { width: '48%', backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' }]}>
            <View style={styles.kpiHeader}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
              <Text style={styles.kpiTitle}>เสร็จสิ้น</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#047857' }]}>{STATS_DATA.completed}</Text>
          </View>

          <View style={[styles.kpiCard, { width: '48%', backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            <View style={styles.kpiHeader}>
              <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
              <Text style={styles.kpiTitle}>ยกเลิก</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#B91C1C' }]}>{STATS_DATA.canceled}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>คะแนนประเมินเฉลี่ย</Text>
        <View style={styles.ratingCard}>
          <View style={styles.ratingTopRow}>
            <View style={styles.ratingOverall}>
              <Text style={styles.bigRatingText}>{STATS_DATA.averageRating}<Text style={styles.maxRatingText}>/5.0</Text></Text>
              {renderStars(Math.round(STATS_DATA.averageRating), 22)}
              <Text style={styles.ratingSubText}>จาก {STATS_DATA.completed} รีวิว</Text>
            </View>
            <View style={styles.ratingDistribution}>
              {STATS_DATA.ratingDistribution.map((item) => (
                <View key={item.stars} style={styles.distRow}>
                  <Text style={styles.distLabel}>{item.stars}</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.percentage}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.subRatingRow}>
            <View style={styles.subRatingItem}>
              <Text style={styles.subRatingLabel}>ความรวดเร็ว</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.subRatingValue}>{STATS_DATA.speedScore}</Text>
              </View>
            </View>
            <View style={styles.subRatingDivider} />
            <View style={styles.subRatingItem}>
              <Text style={styles.subRatingLabel}>คุณภาพงานซ่อม</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.subRatingValue}>{STATS_DATA.qualityScore}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>รีวิวการทำงานล่าสุด</Text>
        <View style={styles.reviewList}>
          {RECENT_REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarText}>{review.name.charAt(0)}</Text></View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewRoom}>{review.room}</Text>
                </View>
                <View style={styles.reviewRight}>
                  {renderStars(review.rating)}
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>"{review.comment}"</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เลือกช่วงเวลา</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
            </View>
            <FlatList
              data={MONTH_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedMonth(item); setModalVisible(false); }}>
                  <Text style={[styles.modalItemText, selectedMonth === item && { color: '#F28C28', fontWeight: '700' }]}>{item}</Text>
                  {selectedMonth === item && <Ionicons name="checkmark-circle" size={20} color="#F28C28" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

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
    color: '#F28C28',
    marginTop: 2,
  },
  notificationBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F28C28',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  kpiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingOverall: {
    alignItems: 'center',
    flex: 0.45,
  },
  bigRatingText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111827',
  },
  maxRatingText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  ratingSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  ratingDistribution: {
    flex: 0.55,
    justifyContent: 'center',
    gap: 4,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    width: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  subRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  subRatingItem: {
    alignItems: 'center',
  },
  subRatingLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  subRatingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subRatingDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F3F4F6',
  },
  reviewList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F28C28',
  },
  reviewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  reviewRoom: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reviewRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  reviewDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#4B5563',
  },
});