import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function TaskDetailScreen() {
  // States สำหรับฟอร์มส่งงาน
  const [workDetails, setWorkDetails] = useState('');
  const [materialCost, setMaterialCost] = useState('100');
  const [afterImages, setAfterImages] = useState<string[]>([]);

  // ข้อมูลพิกัดจำลอง (จุดช่าง -> จุดลูกค้า)
  const techLocation = { latitude: 14.8818, longitude: 102.0205 };
  const userLocation = { latitude: 14.8950, longitude: 102.0120 };

  // ฟังก์ชันเลือกรูปภาพหลังซ่อมเสร็จ
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAfterImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setAfterImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ========================================== */}
        {/* Header (มีแค่ปุ่ม Back)           */}
        {/* ========================================== */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={32} color="#F28C28" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ========================================== */}
          {/* ข้อมูลลูกค้า (Customer Info)               */}
          {/* ========================================== */}
          <View style={styles.customerSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={40} color="#F28C28" />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ชื่อ-นามสกุล</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>จันทร์เจี้ยว วงษ์จันทร์ทรา</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>เบอร์โทร</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>094-423-4324</Text>
              </View>
            </View>
          </View>

          {/* ========================================== */}
          {/* รายละเอียดการซ่อม (Task Info)              */}
          {/* ========================================== */}
          <Text style={styles.sectionTitleCenter}>รายละเอียดการซ่อม</Text>
          
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>หมายเลขแจ้งซ่อม</Text>
              <Text style={styles.infoValue}>#SUT-8829</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ประเภทงาน</Text>
              <Text style={styles.infoValue}>ระบบไฟฟ้า</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>สถานที่</Text>
              <Text style={styles.infoValue}>หอพัก 2, ห้อง 304</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>เบอร์ติดต่อ</Text>
              <Text style={styles.infoValue}>064-622-4562</Text>
            </View>
          </View>

          {/* ========================================== */}
          {/* รายละเอียดปัญหา (Problem Box)              */}
          {/* ========================================== */}
          <View style={styles.problemBox}>
            <Text style={styles.problemTitle}>รายละเอียดปัญหา</Text>
            <Text style={styles.problemText}>
              "โคมไฟในห้องหลักกระพริบและดับลง ช่างได้ดำเนินการเปลี่ยนบัลลาสต์และหลอดไฟใหม่ให้เรียบร้อยแล้ว"
            </Text>
          </View>

          {/* ========================================== */}
          {/* แผนที่พิกัด (GPS Tracking Map)             */}
          {/* ========================================== */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: (techLocation.latitude + userLocation.latitude) / 2,
                longitude: (techLocation.longitude + userLocation.longitude) / 2,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={techLocation} title="ตำแหน่งของคุณ" pinColor="#3B82F6" />
              <Marker coordinate={userLocation} title="จุดเกิดเหตุ" pinColor="#EF4444" />
              <Polyline coordinates={[techLocation, userLocation]} strokeColor="#111827" strokeWidth={3} lineDashPattern={[5, 5]} />
            </MapView>
            
            <View style={styles.mapOverlayInfo}>
              <View style={[styles.mapInfoRow, { marginBottom: 0 }]}>
                <Ionicons name="location" size={20} color="#EF4444" style={styles.mapIcon} />
                <View>
                  <Text style={styles.mapLabel}>ที่อยู่ผู้ใช้บริการ</Text>
                  <Text style={styles.mapValue} numberOfLines={2}>หอพัก 2 มหาวิทยาลัยเทคโนโลยีสุรนารี นครราชสีมา 30000</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ========================================== */}
          {/* ภาพประกอบปัญหา (Before Images)             */}
          {/* ========================================== */}
          <Text style={styles.sectionTitle}>ภาพประกอบ</Text>
          <View style={styles.imageGallery}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300' }} style={styles.attachedImage} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=300' }} style={styles.attachedImage} />
          </View>

          {/* ========================================== */}
          {/* ส่วนส่งงานช่าง: ส่งงานภาพ (After Images)    */}
          {/* ========================================== */}
          <Text style={styles.sectionTitle}>ส่งงานภาพ</Text>
          <View style={styles.previewRow}>
            {afterImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {/* ปุ่มกดเพิ่มรูป (โชว์ตลอดถ้ายังไม่เกินจำนวนที่กำหนด) */}
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} onPress={pickImage}>
              <Ionicons name="camera" size={28} color="#F28C28" />
              <Text style={styles.uploadTitle}>แนบรูป</Text>
              <Text style={styles.uploadSub}>ถ่ายรูปจุดชำรุดเสียหาย</Text>
            </TouchableOpacity>
          </View>

          {/* ========================================== */}
          {/* ส่วนส่งงานช่าง: รายละเอียดการทำงาน          */}
          {/* ========================================== */}
          <Text style={styles.sectionTitle}>รายละเอียดการทำงาน</Text>
          <TextInput
            style={styles.textArea}
            multiline
            textAlignVertical="top"
            placeholder="อธิบายสิ่งที่ได้ดำเนินการซ่อม..."
            placeholderTextColor="#9CA3AF"
            value={workDetails}
            onChangeText={setWorkDetails}
          />

          {/* ========================================== */}
          {/* ส่วนส่งงานช่าง: ค่าวัสดุอุปกรณ์             */}
          {/* ========================================== */}
          <Text style={styles.sectionTitle}>ค่าวัสดุอุปกรณ์</Text>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={materialCost}
            onChangeText={setMaterialCost}
            placeholder="0"
          />

          {/* ========================================== */}
          {/* ปุ่มส่งงาน (Submit)                       */}
          {/* ========================================== */}
          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={() => router.back()}>
            <Text style={styles.submitBtnText}>ส่งงาน</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const ORANGE = '#F28C28';
const DARK_TEXT = '#111827';
const GRAY_TEXT = '#6B7280';

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  
  // Header
  headerBar: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'android' ? 40 : 10, 
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: { 
    width: 44, 
    height: 44, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },

  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },

  // Customer Info
  customerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8F1',
    borderWidth: 2,
    borderColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 6,
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  readOnlyText: {
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '600',
  },

  // Task Info
  sectionTitleCenter: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBlock: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: GRAY_TEXT,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_TEXT,
  },

  // Problem Box
  problemBox: {
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 8,
  },
  problemText: {
    fontSize: 14,
    color: GRAY_TEXT,
    lineHeight: 22,
  },

  // Map Section
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 24,
  },
  map: {
    width: '100%',
    height: 200,
  },
  mapOverlayInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  mapInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  mapIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  mapLabel: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginBottom: 2,
  },
  mapValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_TEXT,
    paddingRight: 20,
  },

  // Section General Titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 12,
  },

  // Images
  imageGallery: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  attachedImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 16, 
  },

  // After Images (Upload)
  previewRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
    marginBottom: 24,
  },
  imageWrapper: { 
    position: 'relative' 
  },
  previewImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 16, 
  },
  removeButton: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    width: 24, 
    height: 24, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#FFFFFF' 
  },
  uploadBox: { 
    width: 110, 
    height: 110, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderColor: '#D1D5DB', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  uploadTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: ORANGE,
    marginTop: 4,
  },
  uploadSub: {
    fontSize: 10,
    color: GRAY_TEXT,
    textAlign: 'center',
    paddingHorizontal: 4,
    marginTop: 2,
  },

  // Text Area
  textArea: { 
    height: 100, 
    backgroundColor: '#FFF8F1',
    borderWidth: 1, 
    borderColor: '#FED7AA', 
    borderRadius: 16, 
    padding: 16, 
    fontSize: 14, 
    color: DARK_TEXT,
    marginBottom: 24,
  },

  // Price Input
  priceInput: {
    height: 52,
    backgroundColor: '#FFF8F1',
    borderWidth: 1, 
    borderColor: '#FED7AA', 
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '600',
    marginBottom: 30,
  },

  // Submit Button
  submitBtn: { 
    height: 56, 
    backgroundColor: ORANGE, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: ORANGE, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4,
    marginHorizontal: 40,
  },
  submitBtnText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
});