import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ==========================================
// ข้อมูลจำลอง (หอพัก และ ห้อง)
// ==========================================
const DORMITORIES = Array.from({ length: 18 }, (_, i) => `สุรนิเวศ ${i + 1}`);
const ROOMS = Array.from({ length: 10 }, (_, i) => `${i + 101}`);

// ==========================================
// Component: Dropdown Picker
// ==========================================
function DropdownPicker({ placeholder, options, selectedValue, onSelect }: any) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.selectBox} 
        activeOpacity={0.7} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectText, selectedValue && { color: '#111827' }]}>
          {selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}>
                  <Text style={[styles.modalItemText, selectedValue === item && { color: '#F28C28', fontWeight: '700' }]}>
                    {item}
                  </Text>
                  {selectedValue === item && <Ionicons name="checkmark-circle" size={20} color="#F28C28" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ==========================================
// Component: ป้ายหมวดหมู่ (Category Chip)
// ==========================================
function CategoryChip({ label, active, icon, type, onPress }: any) {
  const iconColor = active ? '#FFFFFF' : '#6B7280';
  
  const renderIcon = () => {
    if (type === 'ion') return <Ionicons name={icon as any} size={18} color={iconColor} />;
    if (type === 'material') return <MaterialCommunityIcons name={icon as any} size={18} color={iconColor} />;
    return <Feather name={icon as any} size={18} color={iconColor} />;
  };

  return (
    <TouchableOpacity 
      style={[styles.chip, active && styles.chipActive]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      {renderIcon()}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ==========================================
// Main Screen: EditReportScreen
// ==========================================
export default function EditReportScreen() {
  // จำลองว่าดึงข้อมูลเดิมมาแสดง (Pre-filled Data)
  const [selectedDorm, setSelectedDorm] = useState('สุรนิเวศ 1');
  const [selectedRoom, setSelectedRoom] = useState('102');
  const [activeCategory, setActiveCategory] = useState('ประปา');
  const [detail, setDetail] = useState('ก๊อกน้ำใต้อ่างล้างหน้ามีน้ำหยดตลอดเวลา ทำให้พื้นห้องน้ำแฉะ');
  
  // มีรูปเดิมอยู่แล้ว 1 รูป
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop'
  ]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    if (!selectedDorm || !selectedRoom) {
      Alert.alert('ข้อมูลไม่ครบ', 'กรุณาระบุหอพักและเลขห้อง');
      return;
    }
    Alert.alert('สำเร็จ', 'อัปเดตข้อมูลการแจ้งซ่อมเรียบร้อยแล้ว', [
      { text: 'ตกลง', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#F28C28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>แก้ไขการแจ้งซ่อม</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section: สถานที่เกิดปัญหา */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>สถานที่เกิดปัญหา</Text>
          <View style={styles.roomCard}>
            <DropdownPicker
              placeholder="เลือกระบุหอพัก"
              options={DORMITORIES}
              selectedValue={selectedDorm}
              onSelect={(val: string) => { setSelectedDorm(val); setSelectedRoom(''); }}
            />
            <View style={{ height: 12 }} />
            <DropdownPicker
              placeholder="เลือกระบุเลขห้อง"
              options={ROOMS}
              selectedValue={selectedRoom}
              onSelect={setSelectedRoom}
            />
            <TouchableOpacity style={styles.locationRow} activeOpacity={0.7} onPress={() => router.push('/select-location')}>
              <View style={styles.locationIconBox}>
                <Ionicons name="location" size={16} color="#EF4444" />
              </View>
              <Text style={styles.locationText}>แก้ไขพิกัดแผนที่ (GPS)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: หมวดหมู่ปัญหา */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หมวดหมู่ปัญหา</Text>
          <View style={styles.chipWrap}>
            <CategoryChip label="ประปา" icon="water-outline" type="ion" active={activeCategory === 'ประปา'} onPress={() => setActiveCategory('ประปา')} />
            <CategoryChip label="ไฟฟ้า" icon="flash-outline" type="ion" active={activeCategory === 'ไฟฟ้า'} onPress={() => setActiveCategory('ไฟฟ้า')} />
            <CategoryChip label="เฟอร์นิเจอร์" icon="bed-outline" type="ion" active={activeCategory === 'เฟอร์นิเจอร์'} onPress={() => setActiveCategory('เฟอร์นิเจอร์')} />
            <CategoryChip label="เครื่องใช้ไฟฟ้า" icon="tv-outline" type="ion" active={activeCategory === 'เครื่องใช้ไฟฟ้า'} onPress={() => setActiveCategory('เครื่องใช้ไฟฟ้า')} />
            <CategoryChip label="อื่นๆ" icon="more-horizontal" type="feather" active={activeCategory === 'อื่นๆ'} onPress={() => setActiveCategory('อื่นๆ')} />
          </View>
        </View>

        {/* Section: รายละเอียดปัญหา */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>รายละเอียดปัญหา</Text>
          <TextInput
            style={styles.textArea}
            multiline
            textAlignVertical="top"
            placeholder="อธิบายปัญหาที่พบ..."
            placeholderTextColor="#9CA3AF"
            value={detail}
            onChangeText={setDetail}
          />
        </View>

        {/* Section: ภาพประกอบ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ภาพประกอบ</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} onPress={pickImage}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="camera" size={28} color="#F28C28" />
            </View>
            <Text style={styles.uploadTitle}>เพิ่มรูปภาพ</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.previewRow}>
              {images.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)} activeOpacity={0.8}>
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>บันทึกการแก้ไข</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const ORANGE = '#F28C28';
const DARK_TEXT = '#111827';

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  scroll: { 
    flex: 1 
  },
  scrollContent: { 
    paddingBottom: 40 
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  backButton: { 
    width: 44, 
    height: 44, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: DARK_TEXT 
  },
  headerSpace: { 
    width: 44 
  },
  section: { 
    marginTop: 24, 
    paddingHorizontal: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: DARK_TEXT, 
    marginBottom: 12 
  },
  roomCard: {
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    padding: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 1,
  },
  selectBox: {
    height: 50, 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 12, 
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  selectText: { 
    fontSize: 15, 
    color: '#9CA3AF' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingHorizontal: 20, 
    paddingBottom: 40, 
    paddingTop: 10, 
    maxHeight: '60%' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB', 
    marginBottom: 10 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827' 
  },
  modalItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  modalItemText: { 
    fontSize: 16, 
    color: '#4B5563' 
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    backgroundColor: '#FEF2F2', 
    padding: 12, 
    borderRadius: 12 
  },
  locationIconBox: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#FEE2E2', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  locationText: { 
    marginLeft: 10, 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#EF4444' 
  },
  chipWrap: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  chip: { 
    height: 42, 
    borderRadius: 21, 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  chipActive: { 
    borderColor: ORANGE, 
    backgroundColor: ORANGE 
  },
  chipText: { 
    marginLeft: 8, 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#4B5563' 
  },
  chipTextActive: { 
    color: '#FFFFFF' 
  },
  textArea: { 
    height: 120, 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    fontSize: 15, 
    color: DARK_TEXT 
  },
  uploadBox: { 
    height: 120, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderColor: '#D1D5DB', 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  uploadIconCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#FFF3E8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  uploadTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: ORANGE 
  },
  previewRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 
  },
  imageWrapper: { 
    position: 'relative' 
  },
  previewImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  removeButton: { 
    position: 'absolute', 
    top: -8, 
    right: -8, 
    width: 24, 
    height: 24, 
    backgroundColor: '#EF4444', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#FFFFFF' 
  },
  submitButton: { 
    marginTop: 32, 
    marginHorizontal: 20, 
    height: 56, 
    backgroundColor: ORANGE, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: ORANGE, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4 
  },
  submitButtonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
});