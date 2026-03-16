import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminSettingsScreen() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const toggleSwitch = () => setIsNotificationEnabled(previousState => !previousState);

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ระบบซ่อมบำรุงหอพัก</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7} onPress={() => router.push('/(admin)/notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color="#111" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ========================================== */}
        {/* Profile Card (เอาไอคอนดินสอออกแล้ว) */}
        {/* ========================================== */}
        <View style={styles.profileContainer}>
          <View style={styles.profileCard}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={40} color="#7C3AED" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>ADMIN01</Text>
              <Text style={styles.profileRole}>ผู้ดูแลระบบ</Text>
            </View>
          </View>
        </View>

        {/* ========================================== */}
        {/* การแจ้งเตือน */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>การแจ้งเตือน</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrapperGreen}>
              <Ionicons name="notifications" size={18} color="#10B981" />
            </View>
            <Text style={styles.cardText}>แจ้งเตือน</Text>
            <Switch
              trackColor={{ false: '#E5E7EB', true: '#34C759' }}
              thumbColor={'#FFFFFF'}
              onValueChange={toggleSwitch}
              value={isNotificationEnabled}
              style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] } : {}}
            />
          </View>
        </View>

        {/* ========================================== */}
        {/* เกี่ยวกับระบบ */}
        {/* ========================================== */}
        <Text style={styles.sectionTitle}>เกี่ยวกับระบบ</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTextBold}>เวอร์ชันแอปพลิเคชัน</Text>
            <Text style={styles.versionText}>v1.0.2 (Beta)</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* ปุ่มออกจากระบบ */}
        {/* ========================================== */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>

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
    backgroundColor: '#FAFAFA', // สีพื้นหลังเทาอ่อนตามภาพ
  },

  // Header
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
    fontWeight: '700',
    color: '#F28C28', // สีส้มตามภาพ
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
    paddingBottom: 40,
  },

  // Profile Card
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FDBA74', // ขอบสีส้ม
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFEDD5', // พื้นหลังสีส้มอ่อน
    justifyContent: 'flex-end', // ให้ตัวคนติดขอบล่าง
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Sections
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9CA3AF', // สีเทาอ่อน
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconWrapperGreen: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#D1FAE5', // สีเขียวอ่อน
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  cardTextBold: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Logout Button
  logoutBtn: {
    backgroundColor: '#FFF1F2', // สีแดงอ่อนมาก
    marginHorizontal: 20,
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444', // สีแดง
  },
});