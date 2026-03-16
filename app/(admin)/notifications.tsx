import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { router, useNavigation } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";

export default function notifications() {

  const navigation = useNavigation();

  // ซ่อน Tab bar ด้านล่าง
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, []);

  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "งานด่วนเข้าใหม่!",
      detail: "หอสุรนิเวศ 1 ห้อง B-402 แจ้งปัญหาน้ำรั่วรุนแรง โปรดตรวจสอบทันที",
      time: "2 นาทีที่แล้ว",
      isUnread: true, // เพิ่มสถานะว่าอ่านหรือยัง
      bgColor: "#FDE8E8", // สีพื้นหลังกล่อง
      iconColor: "#EF4444", // สีพื้นหลังไอคอน
      icon: "warning"
    },
    {
      id: 2,
      type: "review",
      title: "คุณได้รับรีวิวใหม่!",
      detail: "คุณได้รับ 5 ดาวจาก คุณบิ๊บ (หอสุรนิเวศ 1): 'ทำดีจริงๆ ครับ มาไวมาก'",
      time: "10 นาทีที่แล้ว",
      isUnread: true,
      bgColor: "#F3F4F6", 
      iconColor: "#F59E0B",
      icon: "star"
    },
    {
      id: 3,
      type: "repair",
      title: "คำร้องแจ้งซ่อมใหม่",
      detail: "หอสุรนิเวศ 3 ห้อง A-105 แจ้งปัญหาแอร์ไม่เย็น (หมวดหมู่: เครื่องใช้ไฟฟ้า)",
      time: "15 นาทีที่แล้ว",
      isUnread: true,
      bgColor: "#EBF5FF",
      iconColor: "#3B82F6",
      icon: "build"
    },
    {
      id: 4,
      type: "review",
      title: "คุณได้รับรีวิวใหม่!",
      detail: "คุณได้รับ 3 ดาวจาก คุณมิวสิค: 'ช่างซ่อมดีครับ แต่ลืมเก็บของนิดหน่อย'",
      time: "2 ชม.ที่แล้ว",
      isUnread: false, // ถ้าอ่านแล้ว จุดสีฟ้าจะไม่แสดง
      bgColor: "#FFFFFF",
      iconColor: "#F59E0B",
      icon: "star"
    },
    {
      id: 5,
      type: "repair",
      title: "คำร้องแจ้งซ่อมใหม่",
      detail: "หอสุรนิเวศ 2 ห้อง C-304 แจ้งปัญหาหลอดไฟขาด (หมวดหมู่: ไฟฟ้า)",
      time: "1 วันที่แล้ว",
      isUnread: false,
      bgColor: "#FFFFFF",
      iconColor: "#3B82F6",
      icon: "build"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#F28C28" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>การแจ้งเตือน</Text>
        </View>
        
        {/* เพิ่มปุ่ม 'อ่านทั้งหมด' ทางขวา */}
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.readAllText}>อ่านทั้งหมด</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {notifications.map((item) => (
          // ใส่สีพื้นหลังกล่องตามที่ตั้งไว้ในข้อมูล
          <View key={item.id} style={[styles.card, { backgroundColor: item.bgColor }]}>
            
            {/* กล่องไอคอน */}
            <View style={[styles.iconCircle, { backgroundColor: `${item.iconColor}20` }]}>
              <Ionicons
                name={item.icon as any} // อิงชื่อไอคอนจากข้อมูล
                size={22}
                color={item.iconColor} // สีไอคอนเข้ม สีพื้นหลังอ่อน
              />
            </View>

            {/* เนื้อหา */}
            <View style={styles.contentContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                
                {/* เวลาและจุดสีฟ้า */}
                <View style={styles.timeBadgeRow}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  {item.isUnread && <View style={styles.unreadDot} />}
                </View>
              </View>
              <Text style={styles.detail}>{item.detail}</Text>
            </View>

            {/* // ตรงนี้ถูกลบปุ่ม "มอบหมาย" และป้าย "สถานะ จัดการแล้ว" ออกไปแล้วครับ */}

          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB" // ปรับสีพื้นหลังให้สว่างขึ้น
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 50 : 10,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerCenter: {
    flex: 1,
    paddingLeft: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827"
  },
  backButton: { 
    width: 30, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  readAllText: {
    color: "#F28C28", // สีส้ม
    fontSize: 14,
    fontWeight: "600"
  },

  card: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6", // เส้นกั้นบางๆ ระหว่างแถว
    alignItems: "flex-start" // ให้อยู่ชิดบน
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginTop: 2
  },
  contentContainer: { 
    flex: 1 
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1
  },
  timeBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8 // ระยะห่างระหว่างเวลากับจุดฟ้า
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF"
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6" // จุดสีฟ้า
  },
  detail: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20 // ให้บรรทัดห่างกันนิดนึงอ่านง่ายขึ้น
  }
});