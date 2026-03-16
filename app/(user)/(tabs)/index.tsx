import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

// ==========================================
// Component: การ์ดรายการแจ้งซ่อม (RequestCard)
// ==========================================
type RequestCardProps = {
  iconType: 'material' | 'ionicon' | 'feather';
  iconName: string;
  iconColor: string;
  iconBg: string;
  title: string;
  location: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  showActions?: boolean; 
};

function RequestCard({
  iconType,
  iconName,
  iconColor,
  iconBg,
  title,
  location,
  date,
  status,
  statusColor,
  statusBg,
  showActions = false,
}: RequestCardProps) {
  const renderIcon = () => {
    if (iconType === 'material') {
      return <MaterialCommunityIcons name={iconName as any} size={22} color={iconColor} />;
    }
    if (iconType === 'feather') {
      return <Feather name={iconName as any} size={20} color={iconColor} />;
    }
    return <Ionicons name={iconName as any} size={20} color={iconColor} />;
  };

  const goToDetail = () => {
    router.push('/service-completed');
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={goToDetail}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            {renderIcon()}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>{location}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottomRow}>
        <Text style={styles.cardDate}>สร้างเมื่อ {date}</Text>

        <View style={styles.cardActionRow}>
          {showActions && (
            <>
              <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
              
              {/* === เพิ่มลิงก์ไปหน้าแก้ไขการแจ้งซ่อมที่ปุ่มดินสอ === */}
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.actionBtn}
                onPress={() => router.push('/edit-report')}
              >
                <Feather name="edit-2" size={16} color="#4B5563" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.detailBtn} onPress={goToDetail} activeOpacity={0.7}>
            <Text style={styles.detailText}>รายละเอียด</Text>
            <Ionicons name="chevron-forward" size={16} color="#F28C28" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ==========================================
// Main Screen: HomeScreen
// ==========================================
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          {/* ✅ แก้ไข Path รูปภาพตรงนี้แล้ว (เพิ่ม ../) */}
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ระบบซ่อมบำรุงหอพัก</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7} onPress={() => router.push('/notification')}>
          <Ionicons name="notifications-outline" size={24} color="#111" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.welcomeCard} activeOpacity={0.8} onPress={() => router.push('/profile')}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#F28C28" />
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Hi, SUT Student</Text>
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={14} color="#F28C28" />
              <Text style={styles.locationText}>หอพัก 1 ・ ห้อง 102</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Report Button */}
        <TouchableOpacity style={styles.reportButton} onPress={() => router.push('/report')} activeOpacity={0.8}>
          <Ionicons name="build" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.reportButtonText}>แจ้งซ่อมแซม (Report an Issue)</Text>
        </TouchableOpacity>

        {/* Section Title */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>การแจ้งซ่อมของฉัน</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/history')}>
            <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>

        {/* Request List */}
        <RequestCard
          iconType="material"
          iconName="water-pump"
          iconColor="#F28C28"
          iconBg="#FFF3E8"
          title="ก๊อกน้ำรั่ว"
          location="ห้อง 102 ・ ห้องน้ำ"
          date="24 ต.ค. 2568"
          status="รอดำเนินการ"
          statusColor="#D97706"
          statusBg="#FEF3C7"
          showActions={true}
        />

        <RequestCard
          iconType="ionicon"
          iconName="flash"
          iconColor="#2563EB"
          iconBg="#DBEAFE"
          title="ไฟเพดานกระพริบ"
          location="ห้อง 102 ・ โซนห้องนอน"
          date="22 ต.ค. 2568"
          status="กำลังดำเนินการ"
          statusColor="#1D4ED8"
          statusBg="#BFDBFE"
        />

        <RequestCard
          iconType="feather"
          iconName="wind"
          iconColor="#059669"
          iconBg="#D1FAE5"
          title="ล้างแผ่นกรองแอร์"
          location="ห้อง 102 ・ ห้องนอน"
          date="19 ต.ค. 2568"
          status="เสร็จสมบูรณ์"
          statusColor="#047857"
          statusBg="#A7F3D0"
        />
      </ScrollView>
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
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 14,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F28C28',
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
    paddingBottom: 30,
    paddingTop: 15,
  },
  welcomeCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F28C28',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F28C28',
    marginLeft: 4,
  },
  reportButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#F28C28',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F28C28',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionRow: {
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F28C28',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    height: 145,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginRight: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F28C28',
    marginRight: 2,
  },
});