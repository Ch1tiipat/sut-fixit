import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TechnicianTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ปิด Header ของระบบ (เพราะเราทำ Header เองในแต่ละหน้าแล้ว)
        tabBarActiveTintColor: '#F28C28', // สีส้มตอนกดเลือก
        tabBarInactiveTintColor: '#9CA3AF', // สีเทาตอนไม่ได้กด
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          minHeight: Platform.OS === 'ios' ? 85 : 65, // ป้องกันการทับขีด Home ของ iOS
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
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

      {/* 2. ปุ่มงานของฉัน (กำลังดำเนินการ) */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'งานของฉัน',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'construct' : 'construct-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. ปุ่มประวัติ */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'ประวัติ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. ปุ่มสถิติ */}
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'สถิติ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={24} color={color} />
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