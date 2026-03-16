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

export default function TechProfileInfoScreen() {
  const techData = {
    name: 'ยกหนู รวยไม่ไหว',
    employeeId: 'TECH-660102',
    department: 'ฝ่ายอาคารและสถานที่',
    specialty: 'ระบบไฟฟ้าและประปา',
    phone: '081-234-5678',
    email: 'somchai.s@sut.ac.th',
    joinedDate: '12 มกราคม 2566',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ข้อมูลส่วนตัว</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: 'https://ui-avatars.com/api/?name=Somchai+Tech&background=F28C28&color=fff&size=128' }} style={styles.avatarImage} />
          </View>
          <Text style={styles.techName}>{techData.name}</Text>
          <Text style={styles.techRole}>ช่างเทคนิคอาวุโส</Text>
        </View>
        <View style={styles.infoContainer}>
          <InfoItem label="รหัสพนักงาน" value={techData.employeeId} icon="id-card-outline" />
          <InfoItem label="หน่วยงาน" value={techData.department} icon="business-outline" />
          <InfoItem label="ความเชี่ยวชาญ" value={techData.specialty} icon="hammer-outline" />
          <InfoItem label="เบอร์โทรศัพท์" value={techData.phone} icon="call-outline" />
          <InfoItem label="อีเมล" value={techData.email} icon="mail-outline" />
          <InfoItem label="วันที่เริ่มงาน" value={techData.joinedDate} icon="calendar-outline" />
        </View>
        <Text style={styles.footerNote}>* ข้อมูลนี้แสดงตามฐานข้อมูลกลาง ไม่สามารถแก้ไขได้</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#F28C28" />
      </View>
      <View style={styles.infoTextGroup}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#F9FAFB',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  techName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  techRole: {
    fontSize: 14,
    color: '#F28C28',
    fontWeight: '600',
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 30,
    fontStyle: 'italic',
  },
});