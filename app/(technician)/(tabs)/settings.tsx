import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

// ==========================================
// Component: เมนูรายการย่อย (List Item)
// ==========================================
type MenuItemProps = {
  iconName: string;
  iconColor: string;
  iconBg: string;
  title: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  hideDivider?: boolean;
};

function MenuItem({ iconName, iconColor, iconBg, title, rightComponent, onPress, hideDivider }: MenuItemProps) {
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={onPress ? 0.7 : 1} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName as any} size={20} color={iconColor} />
        </View>
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>

      <View style={styles.menuItemRight}>
        {rightComponent || <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />}
      </View>
      
      {!hideDivider && <View style={styles.divider} />}
    </TouchableOpacity>
  );
}

// ==========================================
// Main Screen: TechSettingsScreen
// ==========================================
export default function TechSettingsScreen() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบบัญชีช่างเทคนิค?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { 
        text: 'ออกจากระบบ', 
        style: 'destructive',
        onPress: () => router.replace('/login') 
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
          <View>
            <Text style={styles.appName}>SUT FixIt</Text>
            <Text style={styles.appSubtitle}>ช่างเทคนิค (Technician)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7} onPress={() => router.push('/(technician)/notification' as any)}>
          <Ionicons name="notifications-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="build" size={32} color="#F28C28" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.techName}>ยกหนู รวยไม่ไหว</Text>
            <Text style={styles.techRole}>ช่างซ่อมบำรุง (ไฟฟ้า/ประปา)</Text>
            <Text style={styles.techId}>รหัสพนักงาน: TECH-8042</Text>
          </View>
        </View>

        {/* Section 1: การตั้งค่าการทำงาน (เอา รับงานด่วน ออกแล้ว) */}
        <Text style={styles.sectionTitle}>การตั้งค่าการทำงาน</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            iconName="notifications" 
            iconColor="#10B981" 
            iconBg="#D1FAE5" 
            title="แจ้งเตือนงานใหม่เข้า" 
            hideDivider
            rightComponent={
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#F28C28' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#D1D5DB"
                onValueChange={() => setIsNotificationEnabled(!isNotificationEnabled)}
                value={isNotificationEnabled}
              />
            }
          />
        </View>

        {/* Section 2: เกี่ยวกับระบบ */}
        <Text style={styles.sectionTitle}>เกี่ยวกับระบบ</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            iconName="information-circle" 
            iconColor="#6B7280" 
            iconBg="#F3F4F6" 
            title="เวอร์ชันแอปพลิเคชัน" 
            hideDivider
            rightComponent={<Text style={styles.versionText}>v1.0.2 (Beta)</Text>}
          />
        </View>

        {/* ปุ่มออกจากระบบ */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F28C28',
  },
  profileInfo: {
    flex: 1,
  },
  techName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  techRole: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  techId: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    position: 'relative',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 66,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});