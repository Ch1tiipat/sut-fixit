import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    Alert, Image, Platform, SafeAreaView, ScrollView, StyleSheet, 
    Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal, FlatList, Linking
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { getAuth } from "firebase/auth";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '../../constants/firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

// 🎯 ข้อมูลพิกัดหอพักสุรนิเวศ 1-17 (พิกัดโดยประมาณ)
const DORM_COORDINATES: Record<string, { lat: number, lng: number }> = {
  "สุรนิเวศ 1": { lat: 14.89527, lng: 102.0151836 },
  "สุรนิเวศ 2": { lat: 14.8960784, lng: 102.0148626 },
  "สุรนิเวศ 3": { lat: 14.896500, lng: 102.014500 },
  "สุรนิเวศ 4": { lat: 14.8970095, lng: 102.0137376 },
  "สุรนิเวศ 5": { lat: 14.897500, lng: 102.013000 },
  "สุรนิเวศ 6": { lat: 14.898000, lng: 102.012500 },
  "สุรนิเวศ 7": { lat: 14.895500, lng: 102.011500 },
  "สุรนิเวศ 8": { lat: 14.8965027, lng: 102.0108475 },
  "สุรนิเวศ 9": { lat: 14.897500, lng: 102.010000 },
  "สุรนิเวศ 10": { lat: 14.898500, lng: 102.009500 },
  "สุรนิเวศ 11": { lat: 14.891000, lng: 102.016000 },
  "สุรนิเวศ 12": { lat: 14.891500, lng: 102.015500 },
  "สุรนิเวศ 13": { lat: 14.890500, lng: 102.015000 },
  "สุรนิเวศ 14": { lat: 14.890000, lng: 102.014500 },
  "สุรนิเวศ 15": { lat: 14.891500, lng: 102.014000 },
  "สุรนิเวศ 16": { lat: 14.892243, lng: 102.0144115 },
  "สุรนิเวศ 17": { lat: 14.893000, lng: 102.013500 },
};

const DORMITORIES = Object.keys(DORM_COORDINATES);

export default function ReportScreen() {
  const mapRef = useRef<MapView>(null);
  const auth = getAuth();

  // Form State
  const [selectedDorm, setSelectedDorm] = useState('เลือกหอพัก');
  const [showDormPicker, setShowDormPicker] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [activeCategory, setActiveCategory] = useState('ประปา');
  const [issueTitle, setIssueTitle] = useState(''); 
  const [detail, setDetail] = useState(''); 
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location State
  const [region, setRegion] = useState({
    latitude: 14.8818,
    longitude: 102.0205,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markerCoord, setMarkerCoord] = useState<any>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    (async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "Users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.dorm) handleSelectDorm(data.dorm); 
          if (data.room) setSelectedRoom(data.room);
        }
      }
    })();
  }, []);

  const handleSelectDorm = (dormName: string) => {
    setSelectedDorm(dormName);
    setShowDormPicker(false);
    const coords = DORM_COORDINATES[dormName];
    if (coords) {
      const newRegion = {
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      setMarkerCoord({ latitude: coords.lat, longitude: coords.lng });
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000); 
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.5 });
    if (!result.canceled) setImages((prev) => [...prev, result.assets[0].uri]);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
    if (!result.canceled) setImages((prev) => [...prev, result.assets[0].uri]);
  };

  const getLocation = async () => {
    setIsFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('แจ้งเตือน', 'กรุณาอนุญาตการเข้าถึงพิกัด');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const newCoord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setMarkerCoord(newCoord);
      const newRegion = { ...region, ...newCoord, latitudeDelta: 0.002, longitudeDelta: 0.002 };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      setSelectedDorm('พิกัดปัจจุบัน (GPS)');
    } catch (error) {
      Alert.alert('ผิดพลาด', 'ไม่สามารถดึงพิกัดได้');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const openInGoogleMaps = () => {
    if (markerCoord) {
      const { latitude, longitude } = markerCoord;
      const url = Platform.select({
        ios: `maps://app?daddr=${latitude},${longitude}`,
        android: `google.navigation:q=${latitude},${longitude}`
      });
      if (url) Linking.openURL(url);
    } else {
      Alert.alert("แจ้งเตือน", "กรุณาปักหมุดบนแผนที่ก่อนครับ");
    }
  };

  const handleSubmit = async () => {
    if (selectedDorm === 'เลือกหอพัก' || !selectedRoom || !detail || !issueTitle) {
      Alert.alert('ข้อมูลไม่ครบ', 'กรุณาระบุข้อมูลและเลือกหอพักให้เรียบร้อย');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      if (!user) return;

      // 1. อัปโหลดรูปภาพ
      const uploadedUrls = [];
      for (const uri of images) {
        const blob: any = await new Promise((res, rej) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => res(xhr.response);
          xhr.onerror = () => rej(new TypeError("Network failed"));
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const fileRef = ref(storage, `reports/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
        await uploadBytes(fileRef, blob);
        uploadedUrls.push(await getDownloadURL(fileRef));
        if (blob.close) blob.close();
      }

      // 2. บันทึกข้อมูลใบแจ้งซ่อม
      const docRef = await addDoc(collection(db, "Reports"), {
        userId: user.uid,
        title: issueTitle,
        category: activeCategory,
        detail,
        dorm: selectedDorm,
        room: selectedRoom,
        status: "รอดำเนินการ",
        createdAt: new Date().toISOString(),
        images: uploadedUrls,
        locationCoords: markerCoord ? { lat: markerCoord.latitude, lng: markerCoord.longitude } : null,
      });

      // 3. อัปเดตหอพัก/ห้อง ในโปรไฟล์ผู้ใช้ (Sync Profile)
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        dorm: selectedDorm,
        room: selectedRoom
      });

      // 4. แจ้งเตือนแอดมินและช่าง
      const staffQuery = query(collection(db, "Users"), where("role", "in", ["admin", "technician"]));
      const staffSnapshot = await getDocs(staffQuery);
      staffSnapshot.forEach(async (staffDoc) => {
        await addDoc(collection(db, "Notifications"), {
            targetUid: staffDoc.id, 
            title: "มีคำร้องแจ้งซ่อมใหม่ 📢",
            body: `แจ้งปัญหา "${issueTitle}" ที่หอ ${selectedDorm} ห้อง ${selectedRoom}`,
            isRead: false,
            type: "new_request",
            jobId: docRef.id,
            createdAt: serverTimestamp()
        });
      });

      Alert.alert('สำเร็จ', 'ส่งคำร้องและอัปเดตโปรไฟล์เรียบร้อยแล้ว', [
        { text: 'ตกลง', onPress: () => router.replace('/(user)/(tabs)') }
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('ผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color="#F28C28" /></TouchableOpacity>
        <Text style={styles.headerTitle}><Text style={{color: '#F28C28'}}>SUT</Text> FixIt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>แจ้งซ่อมแซม</Text>

        <View style={styles.section}>
          <Text style={styles.label}>สถานที่เกิดปัญหา</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowDormPicker(true)}>
              <Text style={[styles.dropdownText, (selectedDorm === 'เลือกหอพัก' || selectedDorm === 'พิกัดปัจจุบัน (GPS)') && {color: '#9CA3AF'}]}>{selectedDorm}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <TextInput style={[styles.input, {marginTop: 12}]} placeholder="ระบุเลขห้อง (เช่น 101)" value={selectedRoom} onChangeText={setSelectedRoom} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>พิกัดบนแผนที่ (ปักหมุดเพื่อนำทาง)</Text>
          <View style={styles.mapCard}>
            <MapView 
              ref={mapRef}
              style={styles.map} 
              region={region} 
              onPress={(e) => {
                setMarkerCoord(e.nativeEvent.coordinate);
                setSelectedDorm('กำหนดเอง (บนแผนที่)');
              }}
            >
              {markerCoord && <Marker coordinate={markerCoord} pinColor="#F28C28" />}
            </MapView>
            
            <TouchableOpacity style={[styles.gpsBtn, { bottom: 60, backgroundColor: '#4285F4' }]} onPress={openInGoogleMaps}>
              <Ionicons name="navigate" size={16} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '700', marginLeft: 5, fontSize: 11 }}>Google Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gpsBtn} onPress={getLocation}>
              <Ionicons name="locate" size={20} color="#F28C28" />
              <Text style={styles.gpsBtnText}>{isFetchingLocation ? "รอ..." : "พิกัดปัจจุบัน"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ข้อมูลปัญหา</Text>
          <TextInput style={styles.input} placeholder="หัวข้อปัญหา (เช่น แอร์ไม่เย็น)" value={issueTitle} onChangeText={setIssueTitle} />
          <TextInput style={[styles.input, styles.textArea, {marginTop: 12}]} multiline placeholder="รายละเอียดเพิ่มเติม..." value={detail} onChangeText={setDetail} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>หมวดหมู่</Text>
          <View style={styles.chipWrap}>
            {['ประปา', 'ไฟฟ้า', 'เฟอร์นิเจอร์', 'เครื่องใช้ไฟฟ้า', 'อื่นๆ'].map((cat) => (
              <TouchableOpacity key={cat} style={[styles.chip, activeCategory === cat && styles.chipActive]} onPress={() => setActiveCategory(cat)}>
                <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ภาพประกอบ</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.uploadBox, { flex: 1 }]} onPress={pickImage}>
              <Ionicons name="image" size={28} color="#F28C28" /><Text style={styles.uploadText}>คลังภาพ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadBox, { flex: 1 }]} onPress={takePhoto}>
              <Ionicons name="camera" size={28} color="#F28C28" /><Text style={styles.uploadText}>ถ่ายรูป</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.previewRow}>
            {images.map((uri, i) => (
              <View key={i} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => setImages(images.filter((_, idx) => idx !== i))}>
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>ส่งคำร้องแจ้งซ่อม</Text>}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showDormPicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>เลือกหอพัก มทส.</Text>
            <FlatList
              data={DORMITORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dormItem} onPress={() => handleSelectDorm(item)}>
                  <Text style={styles.dormItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModal} onPress={() => setShowDormPicker(false)}><Text style={styles.closeModalText}>ปิด</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 20 },
  mainTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB' },
  textArea: { height: 80, textAlignVertical: 'top' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB' },
  dropdownText: { fontSize: 15, color: '#111827', fontWeight: '600' },
  mapCard: { height: 220, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  map: { flex: 1 },
  gpsBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#FFF', flexDirection: 'row', padding: 8, borderRadius: 8, alignItems: 'center', elevation: 4 },
  gpsBtnText: { color: '#F28C28', fontWeight: '700', marginLeft: 5, fontSize: 11 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB' },
  chipActive: { backgroundColor: '#F28C28', borderColor: '#F28C28' },
  chipText: { color: '#4B5563', fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  uploadBox: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#F28C28', borderRadius: 16, padding: 15, alignItems: 'center', backgroundColor: '#FFF' },
  uploadText: { color: '#F28C28', fontWeight: '700', marginTop: 5 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  imageWrapper: { position: 'relative' },
  previewImage: { width: 70, height: 70, borderRadius: 10 },
  removeBtn: { position: 'absolute', top: -5, right: -5 },
  submitButton: { backgroundColor: '#F28C28', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '75%' },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 15, textAlign: 'center', color: '#111827' },
  dormItem: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dormItemText: { fontSize: 16, color: '#374151', textAlign: 'center', fontWeight: '600' },
  closeModal: { marginTop: 15, padding: 16, backgroundColor: '#F3F4F6', borderRadius: 12 },
  closeModalText: { textAlign: 'center', fontWeight: '700', color: '#374151' }
});