import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList
} from 'react-native';

// ✅ 1. นำเข้า Firebase 
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig'; 

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ 2. ดึงข้อมูลจากคอลเลกชัน Notifications
    useEffect(() => {
        const auth = getAuth();
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "Notifications"),
            where("targetUid", "==", auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(docSnap => {
                const notif = docSnap.data();
                
                let rawDate = new Date();
                if (notif.createdAt) {
                    rawDate = notif.createdAt.toDate ? notif.createdAt.toDate() : new Date(notif.createdAt);
                }

                // คำนวณเวลาที่ผ่านไป
                let timeStr = "เมื่อสักครู่";
                const diffMs = new Date().getTime() - rawDate.getTime();
                const diffMins = Math.round(diffMs / 60000);
                const diffHrs = Math.round(diffMs / 3600000);
                const diffDays = Math.round(diffMs / 86400000);

                if (diffMins < 60) timeStr = `${diffMins} นาทีที่แล้ว`;
                else if (diffHrs < 24) timeStr = `${diffHrs} ชม.ที่แล้ว`;
                else timeStr = `${diffDays} วันที่แล้ว`;

                return {
                    id: docSnap.id,
                    title: notif.title || "มีการแจ้งเตือนใหม่",
                    description: notif.body || "",
                    time: timeStr,
                    category: notif.category,
                    type: notif.type,
                    jobId: notif.jobId,
                    isUnread: !notif.isRead,
                    rawDate: rawDate,
                };
            });

            data.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ✅ เปลี่ยนสีและไอคอนให้ครบทุกสถานะการแจ้งเตือน
    const getIconConfig = (type: string, category?: string) => {
        // จัดการตาม Type ของการแจ้งเตือน
        if (type === 'new_request') return { icon: 'warning', color: '#EF4444', bg: '#FDE8E8' };
        if (type === 'report_updated') return { icon: 'create', color: '#8B5CF6', bg: '#EDE9FE' };
        if (type === 'admin_approved' || type === 'job_completed') return { icon: 'checkmark-done-circle', color: '#10B981', bg: '#D1FAE5' };
        if (type === 'user_reviewed') return { icon: 'star', color: '#F59E0B', bg: '#FEF3C7' };

        // จัดการตามหมวดหมู่งาน (กรณีเป็นงานทั่วไป)
        switch (category) {
            case 'ประปา': return { icon: 'water', color: '#3B82F6', bg: '#DBEAFE' };
            case 'ไฟฟ้า': return { icon: 'flash', color: '#EAB308', bg: '#FEF9C3' };
            case 'แอร์': return { icon: 'snow', color: '#06B6D4', bg: '#CFFAFE' };
            case 'เฟอร์นิเจอร์': return { icon: 'bed', color: '#8B5CF6', bg: '#EDE9FE' };
            case 'เครื่องใช้ไฟฟ้า': return { icon: 'tv', color: '#EC4899', bg: '#FCE7F3' };
            default: return { icon: 'build', color: '#F28C28', bg: '#FFF3E8' };
        }
    };

    // ✅ กดที่แจ้งเตือนเพื่ออ่านและเด้งไปถูกหน้า (ครบทุกเคส)
    const handlePressNotification = async (item: any) => {
        try {
            if (item.isUnread) {
                await updateDoc(doc(db, "Notifications", item.id), { isRead: true });
            }
            if (item.jobId) {
                // 1. งานใหม่ -> ไปหน้ารับงาน
                if (item.type === "new_request") {
                    router.push({ pathname: '/(technician)/job-request-detail', params: { id: item.jobId } });
                } 
                // 2. งานเสร็จแล้ว/อนุมัติแล้ว/รีวิวแล้ว -> ไปหน้าประวัติ
                else if (item.type === "admin_approved" || item.type === "job_completed" || item.type === "user_reviewed") {
                    router.push({ pathname: '/(technician)/history-detail', params: { id: item.jobId } });
                } 
                // 3. งานอื่นๆ (กำลังซ่อม/อัปเดต) -> ไปหน้าดำเนินการ
                else {
                    router.push({ pathname: '/(technician)/task-detail', params: { id: item.jobId } });
                }
            }
        } catch (error) {
            console.error("Error opening notification:", error);
        }
    };

    // ✅ ฟังก์ชันอ่านทั้งหมด
    const handleReadAll = async () => {
        try {
            const batch = writeBatch(db);
            let hasUnread = false;

            notifications.forEach(n => {
                if (n.isUnread) {
                    batch.update(doc(db, "Notifications", n.id), { isRead: true });
                    hasUnread = true;
                }
            });

            if (hasUnread) await batch.commit();
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const config = getIconConfig(item.type, item.category);
        return (
            <TouchableOpacity 
                style={[styles.notificationItem, item.isUnread && styles.unreadItemBg]}
                onPress={() => handlePressNotification(item)}
            >
                <View style={[styles.iconCircleItem, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon as any} size={24} color={config.color} />
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.itemHeader}>
                        <Text style={[styles.itemTitle, item.isUnread && styles.unreadText]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={styles.timeBadgeRow}>
                            <Text style={styles.itemTime}>{item.time}</Text>
                            {item.isUnread && <View style={styles.unreadDot} />}
                        </View>
                    </View>
                    <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={28} color="#F28C28" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>การแจ้งเตือน</Text>
                </View>
                {/* ✅ ปุ่มอ่านทั้งหมด */}
                <TouchableOpacity activeOpacity={0.7} onPress={handleReadAll}>
                    <Text style={styles.readAllText}>อ่านทั้งหมด</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#F28C28" /></View>
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="notifications-off-outline" size={40} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyTitle}>ไม่มีการแจ้งเตือนใหม่</Text>
                    <Text style={styles.emptySub}>คุณจะได้รับการแจ้งเตือนเมื่อมีงานใหม่เข้าสู่ระบบ</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
    headerBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15,
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    },
    backButton: { width: 30, justifyContent: 'center', alignItems: 'flex-start' },
    headerCenter: { flex: 1, paddingLeft: 10 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
    readAllText: { color: "#F28C28", fontSize: 14, fontWeight: "600" },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingVertical: 10 },
    notificationItem: {
        flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16,
        marginHorizontal: 16, marginVertical: 6, borderRadius: 16,
        borderWidth: 1, borderColor: '#F3F4F6', elevation: 1,
    },
    unreadItemBg: { backgroundColor: '#FFF8F1', borderColor: '#FED7AA' },
    iconCircleItem: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: '600', color: '#374151', flex: 1 },
    unreadText: { fontWeight: '800', color: '#111827' },
    timeBadgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    itemTime: { fontSize: 12, color: '#9CA3AF' },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
    itemDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
    emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },
});