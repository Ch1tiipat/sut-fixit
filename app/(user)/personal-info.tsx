import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';

// 1. เปลี่ยนจาก updateDoc เป็น setDoc
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../constants/firebaseConfig'; 

export default function PersonalInfoScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // เพิ่ม State ตัวใหม่ ควบคุมเฉพาะปุ่มตอนกดบันทึก
  const [isSaving, setIsSaving] = useState(false);

  // ข้อมูลนักศึกษา
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dorm, setDorm] = useState('');
  const [room, setRoom] = useState('');

  // ดึงข้อมูลจาก Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const docRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setStudentId(data.studentId || '');
            setEmail(data.email || '');
            setFullName(data.fullName || '');
            setPhone(data.phone || '');
            setDorm(data.dorm || '');
            setRoom(data.room || '');
          } else {
             // กรณีล็อคอินด้วยบัญชีที่สร้างจากเว็บ โดยที่ยังไม่มีข้อมูลใน Firestore
             setEmail(currentUser.email || '');
          }
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลส่วนตัว:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ฟังก์ชันบันทึกข้อมูลที่ปรับปรุงใหม่ให้เสถียรขึ้น
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true); // สั่งให้ปุ่มโหลด แทนที่จะเปลี่ยนทั้งหน้าจอ
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const docRef = doc(db, "Users", currentUser.uid);
        
        // ใช้ setDoc + merge: true ปลอดภัยที่สุด ลดการแครช 100%
        await setDoc(docRef, {
          fullName: (fullName || '').trim(),
          phone: (phone || '').trim(),
          dorm: (dorm || '').trim(),
          room: (room || '').trim(),
          // เผื่อคนไม่มีข้อมูลระบบจะได้บันทึกอีเมลติดไปด้วย
          email: currentUser.email, 
        }, { merge: true });
        
        Alert.alert("สำเร็จ", "อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่");
    } finally {
      setIsSaving(false); // ปิดสถานะกำลังโหลด
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#F28C28" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ข้อมูลส่วนตัว</Text>
          <View style={styles.headerRight}>
            {!isEditing && !loading && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="pencil" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color="#F28C28" />
             <Text style={{ marginTop: 10, color: '#6B7280' }}>กำลังโหลดข้อมูล...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={50} color="#F28C28" />
                </View>
                {isEditing && (
                  <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              {isEditing && <Text style={styles.changePhotoText}>เปลี่ยนรูปโปรไฟล์</Text>}
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>รหัสนักศึกษา</Text>
                <View style={[styles.input, styles.inputLocked]}>
                  <Text style={styles.lockedText}>{studentId || '-'}</Text>
                  <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>ชื่อ-นามสกุล</Text>
                <TextInput 
                  style={[styles.input, !isEditing && styles.inputReadOnly]} 
                  value={fullName} 
                  onChangeText={setFullName} 
                  editable={isEditing && !isSaving} 
                  placeholder={isEditing ? "กรอกชื่อ-นามสกุล" : "ยังไม่ระบุ"}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>เบอร์โทรศัพท์</Text>
                <TextInput 
                  style={[styles.input, !isEditing && styles.inputReadOnly]} 
                  value={phone} 
                  onChangeText={setPhone} 
                  keyboardType="phone-pad"
                  editable={isEditing && !isSaving}
                  placeholder="08X-XXX-XXXX"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>อีเมล</Text>
                <View style={[styles.input, styles.inputLocked]}>
                  <Text style={styles.lockedText}>{email || '-'}</Text>
                  <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.rowInput}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>หอพัก</Text>
                  <TextInput 
                    style={[styles.input, !isEditing && styles.inputReadOnly]} 
                    value={dorm} 
                    onChangeText={setDorm} 
                    editable={isEditing && !isSaving}
                    placeholder={isEditing ? "กรอกชื่อหอพัก" : "ยังไม่ระบุ"}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 0.6 }]}>
                  <Text style={styles.label}>ห้อง</Text>
                  <TextInput 
                    style={[styles.input, !isEditing && styles.inputReadOnly]} 
                    value={room} 
                    onChangeText={setRoom} 
                    editable={isEditing && !isSaving}
                    placeholder={isEditing ? "เลขห้อง" : "-"}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {isEditing ? (
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  activeOpacity={0.8}
                  onPress={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
                  activeOpacity={0.8}
                  onPress={handleSaveProfile} 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.8}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.primaryButtonText}>แก้ไขข้อมูลส่วนตัว</Text>
              </TouchableOpacity>
            )}

          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', zIndex: 10,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerRight: { width: 44, alignItems: 'flex-end', justifyContent: 'center' }, 
  scrollContent: { flexGrow: 1, paddingBottom: 40, paddingHorizontal: 20 },
  avatarSection: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF3E8',
    justifyContent: 'center', alignItems: 'center', borderWidth: 3,
    borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0, width: 32, height: 32,
    borderRadius: 16, backgroundColor: '#F28C28', justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF',
  },
  changePhotoText: { fontSize: 14, fontWeight: '600', color: '#F28C28' },
  formCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
    elevation: 2, borderWidth: 1, borderColor: '#F3F4F6',
  },
  inputGroup: { marginBottom: 16 },
  rowInput: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 8, marginLeft: 4 },
  input: {
    width: '100%', height: 52, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 16, fontSize: 15, color: '#111827', borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputReadOnly: { backgroundColor: '#F9FAFB', borderColor: 'transparent', color: '#4B5563' },
  inputLocked: {
    backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', borderColor: 'transparent',
  },
  lockedText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10, marginBottom: 20 },
  primaryButton: {
    marginTop: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  primaryButtonText: { color: '#374151', fontSize: 16, fontWeight: '700' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  cancelButton: {
    flex: 1, backgroundColor: '#F3F4F6', height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  cancelButtonText: { color: '#4B5563', fontSize: 16, fontWeight: '700' },
  saveButton: {
    flex: 1, backgroundColor: '#F28C28', height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', shadowColor: '#F28C28',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});