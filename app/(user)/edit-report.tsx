import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
} from "react-native";

// ✅ 1. นำเข้า API เพิ่มเติมเพื่อยิงแจ้งเตือน
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";

const DORMITORIES = Array.from({ length: 18 }, (_, i) => `สุรนิเวศ ${i + 1}`);
const ROOMS = Array.from({ length: 10 }, (_, i) => `${i + 101}`);

function DropdownPicker({
  placeholder,
  options,
  selectedValue,
  onSelect,
}: any) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.selectBox}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.selectText, selectedValue && { color: "#111827" }]}
        >
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
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedValue === item && {
                        color: "#F28C28",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedValue === item && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#F28C28"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function CategoryChip({ label, active, icon, type, onPress }: any) {
  const iconColor = active ? "#FFFFFF" : "#6B7280";
  const renderIcon = () => {
    if (type === "ion")
      return <Ionicons name={icon as any} size={18} color={iconColor} />;
    if (type === "material")
      return (
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={iconColor}
        />
      );
    return <Feather name={icon as any} size={18} color={iconColor} />;
  };
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      {renderIcon()}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function EditReportScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [selectedDorm, setSelectedDorm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [detail, setDetail] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "Reports", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelectedDorm(data.dorm || "");
          setSelectedRoom(data.room || "");
          setActiveCategory(data.category || "ประปา");
          setDetail(data.detail || "");
          setImages(data.images || []);
        } else {
          Alert.alert("ไม่พบข้อมูล", "หาใบแจ้งซ่อมนี้ไม่พบในระบบ");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleUpdate = async () => {
    if (!id) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบรหัสรายการแจ้งซ่อม");
      return;
    }
    if (!selectedDorm || !selectedRoom || !detail) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณาระบุข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      setIsUpdating(true);
      const docRef = doc(db, "Reports", id as string);
      const newTitle =
        detail.substring(0, 25) + (detail.length > 25 ? "..." : "");

      // 1. อัปเดตใบแจ้งซ่อม
      await updateDoc(docRef, {
        dorm: selectedDorm,
        room: selectedRoom,
        category: activeCategory,
        detail: detail,
        title: newTitle,
        images: images,
        updatedAt: new Date().toISOString(),
      });

      // ✅ 2. ยิงการแจ้งเตือนหาแอดมินทุกคน ว่ามีการอัปเดตแจ้งซ่อม
      const adminQuery = query(
        collection(db, "Users"),
        where("role", "==", "admin"),
      );
      const adminSnapshot = await getDocs(adminQuery);

      adminSnapshot.forEach(async (adminDoc) => {
        await addDoc(collection(db, "Notifications"), {
          targetUid: adminDoc.id, // ส่งหาแอดมิน
          title: "มีการอัปเดตใบแจ้งซ่อม 📝",
          body: `ใบแจ้งซ่อม ${(id as string).substring(0, 8).toUpperCase()} (หอพัก ${selectedDorm} ห้อง ${selectedRoom}) ถูกแก้ไขโดยนักศึกษา`,
          isRead: false,
          type: "report_updated",
          category: activeCategory,
          jobId: id,
          createdAt: serverTimestamp(),
        });
      });

      Alert.alert("สำเร็จ", "อัปเดตข้อมูลเรียบร้อยแล้ว", [
        {
          text: "ตกลง",
          onPress: () => router.replace("/(user)/(tabs)" as any),
        },
      ]);
    } catch (error: any) {
      console.error("Error updating report:", error);
      Alert.alert("ข้อผิดพลาด", "บันทึกข้อมูลไม่สำเร็จ: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F28C28" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#F28C28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>แก้ไขการแจ้งซ่อม</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>สถานที่เกิดปัญหา</Text>
          <View style={styles.roomCard}>
            <DropdownPicker
              placeholder="เลือกหอพัก"
              options={DORMITORIES}
              selectedValue={selectedDorm}
              onSelect={(val: string) => {
                setSelectedDorm(val);
                setSelectedRoom("");
              }}
            />
            <View style={{ height: 12 }} />
            <DropdownPicker
              placeholder="เลขห้อง"
              options={ROOMS}
              selectedValue={selectedRoom}
              onSelect={setSelectedRoom}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หมวดหมู่ปัญหา</Text>
          <View style={styles.chipWrap}>
            {["ประปา", "ไฟฟ้า", "เฟอร์นิเจอร์", "เครื่องใช้ไฟฟ้า", "อื่นๆ"].map(
              (cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  icon={
                    cat === "ประปา"
                      ? "water-outline"
                      : cat === "ไฟฟ้า"
                        ? "flash-outline"
                        : cat === "เฟอร์นิเจอร์"
                          ? "bed-outline"
                          : cat === "เครื่องใช้ไฟฟ้า"
                            ? "tv-outline"
                            : "more-horizontal"
                  }
                  type={cat === "อื่นๆ" ? "feather" : "ion"}
                  onPress={() => setActiveCategory(cat)}
                />
              ),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>รายละเอียดปัญหา</Text>
          <TextInput
            style={styles.textArea}
            multiline
            textAlignVertical="top"
            placeholder="อธิบายปัญหาที่พบ..."
            value={detail}
            onChangeText={setDetail}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ภาพประกอบ</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            <View style={styles.uploadIconCircle}>
              <Ionicons name="camera" size={28} color="#F28C28" />
            </View>
            <Text style={styles.uploadTitle}>เพิ่มรูปภาพ</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.previewRow}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isUpdating && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>บันทึกการแก้ไข</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  headerBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  headerSpace: { width: 44 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    elevation: 1,
  },
  selectBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontSize: 15, color: "#9CA3AF" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalItemText: { fontSize: 16, color: "#4B5563" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  chipActive: { borderColor: "#F28C28", backgroundColor: "#F28C28" },
  chipText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  chipTextActive: { color: "#FFFFFF" },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    fontSize: 15,
    color: "#111827",
  },
  uploadBox: {
    height: 120,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadTitle: { fontSize: 15, fontWeight: "700", color: "#F28C28" },
  previewRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  imageWrapper: { position: "relative" },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  submitButton: {
    marginTop: 32,
    marginHorizontal: 20,
    height: 56,
    backgroundColor: "#F28C28",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  submitButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
});
