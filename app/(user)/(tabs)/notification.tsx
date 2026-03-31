import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';

// ✅ 1. เพิ่ม writeBatch และ updateDoc เพื่อใช้บันทึกการอ่าน
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../constants/firebaseConfig'; 

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('ใหม่ล่าสุด');
    const [sortModalVisible, setSortModalVisible] = useState(false);

    const SORT_OPTIONS = ['ใหม่ล่าสุด', 'เก่าที่สุด'];

    // ✅ ปรับให้รองรับข้อมูลจากคอลเลกชัน Notifications
    const getIconConfig = (type: string, category?: string) => {
        if (type === 'repair_completed' || type === 'status_update') {
            return { icon: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5', lib: 'ion' };
        }
        
        switch (category) {
            case 'ประปา': return { icon: 'water', color: '#3B82F6', bg: '#DBEAFE', lib: 'ion' };
            case 'ไฟฟ้า': return { icon: 'flash', color: '#EAB308', bg: '#FEF08A', lib: 'ion' };
            case 'แอร์': return { icon: 'snow', color: '#06B6D4', bg: '#CFFAFE', lib: 'ion' };
            case 'เฟอร์นิเจอร์': return { icon: 'bed', color: '#8B5CF6', bg: '#EDE9FE', lib: 'ion' };
            default: return { icon: 'notifications', color: '#F28C28', bg: '#FFF3E8', lib: 'ion' };
        }
    };

    useEffect(() => {
        const auth = getAuth();
        if (!auth.currentUser) return;

        // ✅ เปลี่ยนไปดึงข้อมูลจากตาราง Notifications
        const q = query(
            collection(db, "Notifications"),
            where("targetUid", "==", auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(docSnap => {
                const notif = docSnap.data();
                
                // แปลงเวลาให้ถูกต้อง (รองรับทั้ง Timestamp ของ Firebase และ String)
                let rawDate = new Date();
                if (notif.createdAt) {
                    rawDate = notif.createdAt.toDate ? notif.createdAt.toDate() : new Date(notif.createdAt);
                }

                return {
                    id: docSnap.id,
                    title: notif.title || 'มีการแจ้งเตือนใหม่',
                    message: notif.body || '',
                    isRead: notif.isRead || false,
                    type: notif.type || 'general',
                    jobId: notif.jobId || null,
                    category: notif.category || 'อื่นๆ',
                    time: rawDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                    rawDate: rawDate,
                };
            });

            // เรียงลำดับเวลา (ใหม่ล่าสุด หรือ เก่าที่สุด)
            data.sort((a, b) => {
                return sortOption === 'ใหม่ล่าสุด' 
                    ? b.rawDate.getTime() - a.rawDate.getTime()
                    : a.rawDate.getTime() - b.rawDate.getTime();
            });
            
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sortOption]); // รีเฟรชเมื่อเปลี่ยนการจัดเรียง

    // ✅ ฟังก์ชันเมื่อกดที่แจ้งเตือน (อัปเดตสถานะเป็น "อ่านแล้ว" ลง DB ทันที)
    const handlePressNotification = async (item: any) => {
        try {
            if (!item.isRead) {
                const docRef = doc(db, "Notifications", item.id);
                await updateDoc(docRef, { isRead: true });
            }
            
            // ถ้าระบุ jobId มา ให้พาไปหน้าสรุปงาน (หรือแก้เป็นหน้าอื่นตามความเหมาะสม)
            if (item.jobId) {
                router.push({ pathname: '/service-completed', params: { id: item.jobId } } as any);
            }
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };

    // ✅ ฟังก์ชัน "อ่านทั้งหมด" (อัปเดตทุกรายการลง DB พร้อมกันด้วย Batch)
    const handleMarkAllAsRead = async () => {
        try {
            const batch = writeBatch(db);
            let hasUnread = false;

            notifications.forEach(n => {
                if (!n.isRead) {
                    const docRef = doc(db, "Notifications", n.id);
                    batch.update(docRef, { isRead: true });
                    hasUnread = true;
                }
            });

            if (hasUnread) {
                await batch.commit();
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const config = getIconConfig(item.type, item.category);

        return (
            <TouchableOpacity 
                style={[styles.notificationItem, !item.isRead && styles.unreadItem]} 
                onPress={() => handlePressNotification(item)}
            >
                <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
                    {config.lib === 'material' ? (
                        <MaterialCommunityIcons name={config.icon as any} size={24} color={config.color} />
                    ) : (
                        <Ionicons name={config.icon as any} size={24} color={config.color} />
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                    <Text style={styles.timeText}>{item.time} น.</Text>
                </View>

                {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
                    <View>
                        <Text style={styles.appName}>SUT FixIt</Text>
                        <Text style={styles.appSubtitle}>ระบบซ่อมบำรุงหอพัก</Text>
                    </View>
                </View>
                {/* ✅ ผูกปุ่มเข้ากับฟังก์ชันอัปเดตลง Database */}
                <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllAsRead}>
                    <Ionicons name="checkmark-done-outline" size={20} color="#F28C28" />
                    <Text style={styles.markReadText}>อ่านทั้งหมด</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>การแจ้งเตือน</Text>
                <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
                    <Ionicons name="filter" size={14} color="#6B7280" />
                    <Text style={styles.sortButtonText}>เรียงตาม: {sortOption}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#F28C28" style={{ marginTop: 20 }} />
            ) : notifications.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
                    <Text style={{ color: '#9CA3AF', marginTop: 10 }}>ไม่มีการแจ้งเตือนใหม่</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}

            {/* Modal Sort */}
            <Modal visible={sortModalVisible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>เรียงลำดับ</Text>
                            <TouchableOpacity onPress={() => setSortModalVisible(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
                        </View>
                        {SORT_OPTIONS.map((option) => (
                            <TouchableOpacity key={option} style={styles.modalItem} onPress={() => { setSortOption(option); setSortModalVisible(false); }}>
                                <Text style={[styles.modalItemText, sortOption === option && { color: '#F28C28', fontWeight: '700' }]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    logoImage: { width: 54, height: 54, borderRadius: 12, marginRight: 14 },
    appName: { fontSize: 18, fontWeight: '800', color: '#111827' },
    appSubtitle: { fontSize: 12, fontWeight: '500', color: '#F28C28', marginTop: 2 },
    readAllBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#F0E4D8' },
    markReadText: { fontSize: 12, fontWeight: '700', color: '#F28C28', marginLeft: 4 },
    pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, backgroundColor: '#FFFFFF' },
    pageTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
    sortButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', gap: 4 },
    sortButtonText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
    listContent: { paddingBottom: 20 },
    notificationItem: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
    unreadItem: { backgroundColor: '#FFF8F1' },
    iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    textContainer: { flex: 1, justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 4 },
    unreadText: { fontWeight: '800', color: '#111827' },
    message: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 6 },
    timeText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
    unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F28C28', alignSelf: 'center', marginLeft: 10 },
    separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 86 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 10 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    modalItemText: { fontSize: 16, color: '#4B5563' },
});