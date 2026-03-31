import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';

// 1. เชื่อมต่อ Firebase และเพิ่ม doc, getDoc
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../constants/firebaseConfig'; 

export default function TechTasksScreen() {
    const [activeTasks, setActiveTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ เพิ่ม State สำหรับจัดการการแจ้งเตือน
    const [unreadCount, setUnreadCount] = useState(0);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        let unsubTasks = () => {};
        let unsubUser = () => {};
        let unsubNotif = () => {};

        // 1. ดึงงานกำลังดำเนินการ
        const qTasks = query(collection(db, "Reports"), where("status", "==", "กำลังดำเนินการ"));
        unsubTasks = onSnapshot(qTasks, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActiveTasks(data);
            setLoading(false);
        });

        // 2. ดึงสถานะการแจ้งเตือนของช่าง
        unsubUser = onSnapshot(doc(db, "Users", user.uid), (docSnap) => {
            if (docSnap.exists()) setUserData(docSnap.data());
        });

        // 3. นับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
        const qNotif = query(
            collection(db, "Notifications"),
            where("targetUid", "==", user.uid),
            where("isRead", "==", false)
        );
        unsubNotif = onSnapshot(qNotif, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return () => { unsubTasks(); unsubUser(); unsubNotif(); };
    }, []);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'ประปา': return '#3B82F6';
            case 'ไฟฟ้า': return '#EAB308';
            case 'แอร์': return '#06B6D4';
            default: return '#F28C28';
        }
    };

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
                {/* ✅ อัปเดตปุ่มกระดิ่งให้มีตัวเลขแจ้งเตือน */}
                <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/(technician)/notification' as any)}>
                    <Ionicons name="notifications-outline" size={26} color="#111" />
                    {userData?.pushEnabled !== false && unreadCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>งานที่กำลังดำเนินการ</Text>
                <Text style={styles.pageSubtitle}>คุณมี {activeTasks.length} งานที่ต้องจัดการต่อ</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color="#F28C28" style={{ marginTop: 20 }} />
                ) : activeTasks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="clipboard-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>ยังไม่มีงานที่รับไว้</Text>
                    </View>
                ) : (
                    activeTasks.map((task) => {
                        const themeColor = getCategoryColor(task.category);
                        return (
                            <View key={task.id} style={[styles.activeCard, { borderColor: themeColor + '30' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.taskTypeBadge, { backgroundColor: themeColor }]}>
                                        <Ionicons name="build" size={14} color="#FFFFFF" />
                                        <Text style={styles.taskTypeText}>{task.category}</Text>
                                    </View>
                                    <Text style={styles.timeText}>
                                        {task.acceptedAt ? `รับงานเมื่อ ${new Date(task.acceptedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.` : ''}
                                    </Text>
                                </View>

                                <View style={styles.cardBody}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <View style={styles.locationRow}>
                                        <Ionicons name="location" size={16} color={themeColor} />
                                        <Text style={[styles.locationText, { color: themeColor }]}>
                                            {task.dorm} ・ ห้อง {task.room}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity 
                                        style={[styles.updateBtn, { backgroundColor: themeColor }]} 
                                        activeOpacity={0.8}
                                        onPress={() => router.push({ 
                                            pathname: '/(technician)/task-detail' as any, 
                                            params: { id: task.id } 
                                        })}
                                    >
                                        <Text style={styles.updateBtnText}>อัปเดตสถานะ / ปิดงาน</Text>
                                        <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    logoImage: { width: 44, height: 44, borderRadius: 10, marginRight: 12 },
    appName: { fontSize: 18, fontWeight: '800', color: '#111827' },
    appSubtitle: { fontSize: 12, fontWeight: '600', color: '#F28C28', marginTop: 2 },
    
    // ✅ อัปเดตสไตล์กระดิ่ง
    notificationBtn: { padding: 8, position: 'relative' },
    notificationBadge: { position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, backgroundColor: '#EF4444', borderRadius: 9, borderWidth: 1.5, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

    pageHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
    pageTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
    pageSubtitle: { fontSize: 14, color: '#6B7280' },
    scrollContent: { paddingBottom: 30 },
    activeCard: { backgroundColor: '#FFFFFF', marginHorizontal: 20, marginBottom: 16, borderRadius: 20, padding: 16, borderWidth: 1, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    taskTypeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    taskTypeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    timeText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    cardBody: { marginBottom: 20 },
    taskTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
    locationText: { fontSize: 13, fontWeight: '700' },
    actionRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
    updateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
    updateBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#9CA3AF', marginTop: 10, fontSize: 16 }
});