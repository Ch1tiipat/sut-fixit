import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

// ==========================================
// ฐานข้อมูลพิกัดหอพัก มทส. (อัปเดตพิกัดจริง + แยกโซนหอ 13)
// ==========================================
const FEMALE_DORMS = [
  { id: 'S1', name: 'สุรนิเวศ 1', lat: 14.89527, lng: 102.0151836 },
  { id: 'S2', name: 'สุรนิเวศ 2', lat: 14.8960784, lng: 102.0135751 },
  { id: 'S3', name: 'สุรนิเวศ 3', lat: 14.8961225, lng: 102.0115534 },
  { id: 'S4', name: 'สุรนิเวศ 4', lat: 14.8970095, lng: 102.0124501 },
  { id: 'S5', name: 'สุรนิเวศ 5', lat: 14.8978117, lng: 102.0120178 },
  { id: 'S6', name: 'สุรนิเวศ 6', lat: 14.8984894, lng: 102.0126933 },
  { id: 'S14', name: 'สุรนิเวศ 14', lat: 14.8967175, lng: 102.0132709 },
  { id: 'S15', name: 'สุรนิเวศ 15', lat: 14.8914348, lng: 102.0162096 },
  { id: 'S16', name: 'สุรนิเวศ 16', lat: 14.892243, lng: 102.0118366 },
  { id: 'S18', name: 'สุรนิเวศ 18', lat: 14.8926039, lng: 102.012322 },
];

const MALE_DORMS = [
  { id: 'S7', name: 'สุรนิเวศ 7', lat: 14.8967987, lng: 102.0089029 },
  { id: 'S8', name: 'สุรนิเวศ 8', lat: 14.8965027, lng: 102.0082726 },
  { id: 'S9', name: 'สุรนิเวศ 9', lat: 14.896423, lng: 102.0073878 },
  { id: 'S10', name: 'สุรนิเวศ 10', lat: 14.8957828, lng: 102.007098 },
  { id: 'S11', name: 'สุรนิเวศ 11', lat: 14.8984056, lng: 102.0081753 },
  { id: 'S12', name: 'สุรนิเวศ 12', lat: 14.8975994, lng: 102.0079451 },
  { id: 'S13_UP', name: 'สุรนิเวศ 13 (โซนบน)', lat: 14.8987332, lng: 102.0126471 },
  { id: 'S13_DOWN', name: 'สุรนิเวศ 13 (โซนล่าง)', lat: 14.8996349, lng: 102.0115041 },
  { id: 'S17', name: 'สุรนิเวศ 17', lat: 14.864124, lng: 102.033928 },
];

const ALL_DORMS = [...FEMALE_DORMS, ...MALE_DORMS];

export default function SelectLocationScreen() {
  const [loading, setLoading] = useState(true);
  const [activeDorm, setActiveDorm] = useState<string | null>(null);
  const [address, setAddress] = useState('กำลังค้นหาพิกัด...');
  
  // พิกัดเริ่มต้น (ปรับมาตรงกลางโซนหอพัก มทส.)
  const [region, setRegion] = useState<Region>({
    latitude: 14.8950,
    longitude: 102.0120,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });
  
  const [marker, setMarker] = useState({
    latitude: 14.8950,
    longitude: 102.0120,
  });

  // ฟังก์ชันแปลงพิกัดเป็นชื่อสถานที่
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) {
        const place = results[0];
        const formattedAddress = `${place.name || ''} ${place.street || ''} ${place.district || ''}`.trim();
        setAddress(formattedAddress || `พิกัด: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      } else {
        setAddress(`พิกัด: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    } catch {
      setAddress(`พิกัด: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  };

  // ดึง GPS ตอนเปิดหน้าจอ
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('แจ้งเตือน', 'กรุณาเปิด GPS เพื่อระบุตำแหน่งปัจจุบัน');
          setLoading(false);
          return;
        }

        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = current.coords;

        setRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 });
        setMarker({ latitude, longitude });
        await reverseGeocode(latitude, longitude);
      } catch (error) {
        console.log('Location Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLocation();
  }, []);

  // เมื่อผู้ใช้กดที่แผนที่
  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setActiveDorm(null); // ยกเลิกการเลือกหอพักเดิม
    setMarker({ latitude, longitude });
    setRegion(prev => ({ ...prev, latitude, longitude }));
    await reverseGeocode(latitude, longitude);
  };

  // เมื่อผู้ใช้กดเลือกปุ่มหอพัก
  const handleSelectDorm = (dormId: string, lat: number, lng: number, name: string) => {
    setActiveDorm(dormId);
    setMarker({ latitude: lat, longitude: lng });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.002, // ซูมเข้าไปใกล้ๆ เพื่อให้เห็นตึกชัดๆ
      longitudeDelta: 0.002,
    });
    setAddress(`มหาวิทยาลัยเทคโนโลยีสุรนารี (${name})`);
  };

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนแผนที่ */}
      <View style={styles.mapArea}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker 
            coordinate={marker} 
            title={activeDorm ? ALL_DORMS.find(d => d.id === activeDorm)?.name : "จุดเกิดเหตุ"}
            pinColor="#F28C28"
          />
        </MapView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#F28C28" />
              <Text style={styles.loadingText}>กำลังค้นหาตำแหน่ง...</Text>
            </View>
          </View>
        )}
      </View>

      {/* ส่วนควบคุมด้านล่าง (Bottom Sheet) */}
      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />
        
        <Text style={styles.sheetTitle}>ระบุพิกัดที่เกิดปัญหา</Text>
        
        {/* กล่องแสดงที่อยู่ปัจจุบัน */}
        <View style={styles.addressBox}>
          <Ionicons name="location" size={24} color="#EF4444" style={styles.addressIcon} />
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressLabel}>ตำแหน่งที่เลือก</Text>
            <Text style={styles.addressValue} numberOfLines={2}>{address}</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* โซนเลือกหอพัก (แยกชาย-หญิง)                  */}
        {/* ========================================== */}
        <View style={styles.dormListContainer}>
          
          {/* แถวหอหญิง */}
          <Text style={styles.dormLabel}>หอพักหญิง</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {FEMALE_DORMS.map((dorm) => (
              <TouchableOpacity
                key={dorm.id}
                style={[styles.dormChip, activeDorm === dorm.id && styles.dormChipActive]}
                activeOpacity={0.7}
                onPress={() => handleSelectDorm(dorm.id, dorm.lat, dorm.lng, dorm.name)}
              >
                <Ionicons 
                  name="business" 
                  size={14} 
                  color={activeDorm === dorm.id ? '#FFFFFF' : '#EC4899'} 
                />
                <Text style={[styles.dormChipText, activeDorm === dorm.id && styles.dormChipTextActive]}>
                  {dorm.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* แถวหอชาย */}
          <Text style={[styles.dormLabel, { marginTop: 12 }]}>หอพักชาย</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {MALE_DORMS.map((dorm) => (
              <TouchableOpacity
                key={dorm.id}
                style={[styles.dormChip, activeDorm === dorm.id && styles.dormChipActive]}
                activeOpacity={0.7}
                onPress={() => handleSelectDorm(dorm.id, dorm.lat, dorm.lng, dorm.name)}
              >
                <Ionicons 
                  name="business" 
                  size={14} 
                  color={activeDorm === dorm.id ? '#FFFFFF' : '#3B82F6'} 
                />
                <Text style={[styles.dormChipText, activeDorm === dorm.id && styles.dormChipTextActive]}>
                  {dorm.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave}>
          <Text style={styles.saveButtonText}>ยืนยันพิกัดนี้</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const ORANGE = '#F28C28';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapArea: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  addressIcon: {
    marginRight: 14,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 20,
  },
  dormListContainer: {
    marginBottom: 10,
  },
  dormLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 5,
    gap: 8,
  },
  dormChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dormChipActive: {
    backgroundColor: ORANGE,
    borderColor: '#E67E22',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dormChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
  },
  dormChipTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 10,
    height: 56,
    backgroundColor: ORANGE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});