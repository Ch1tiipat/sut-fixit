import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ปิดหัวด้านบน
        tabBarActiveTintColor: '#F28C28', // สีส้ม มทส. เวลาถูกเลือก
        tabBarInactiveTintColor: '#9CA3AF', // สีเทา เวลาไม่ได้เลือก
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}>
      
      {/* 1. ปุ่มหน้าแรก */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าแรก',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. ปุ่มประวัติการทำงาน */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'ประวัติ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. ปุ่มสถิติ */}
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'สถิติ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. ปุ่มตรวจงาน */}
      <Tabs.Screen
        name="review"
        options={{
          title: 'ตรวจงาน',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 5. ปุ่มตั้งค่า */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'ตั้งค่า',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}



// ==========================================
// ส่วนตกแต่ง UI ให้เมนูด้านล่างดูสวยและเป็นระเบียบ
// ==========================================
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    height: Platform.OS === 'ios' ? 85 : 70, 
    paddingBottom: Platform.OS === 'ios' ? 25 : 12, 
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8, 
  },
  tabBarLabel: {
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 4, 
  },
  tabBarIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});