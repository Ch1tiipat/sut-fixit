import { Ionicons } from '@expo/vector-icons';
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

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ฟังก์ชันจำลองการเข้าสู่ระบบ
  const handleLogin = () => {
    if (username.toLowerCase() === 'admin') {
      router.replace('/(admin)/(tabs)' as any);
    } else {
      // TODO: ใส่ Path สำหรับไปหน้านักศึกษาตรงนี้
      router.replace('/(user)/(tabs)' as any); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* ========================================== */}
          {/* Logo & Header Section */}
          {/* ========================================== */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} // ตรวจสอบ Path รูปภาพโลโก้ของคุณ
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.welcomeText}>ยินดีต้อนรับสู่</Text>
            <Text style={styles.appNameText}>SUT FixIt</Text>
            <Text style={styles.subtitleText}>
              ระบบแจ้งซ่อมแซมและบำรุงรักษาหอพัก{'\n'}มหาวิทยาลัยเทคโนโลยีสุรนารี
            </Text>
          </View>

          {/* ========================================== */}
          {/* Test Mode Banner */}
          {/* ========================================== */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={22} color="#3B82F6" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '800' }}>โหมดทดสอบ: </Text> 
              พิมพ์ <Text style={{ color: '#EF4444', fontWeight: '800' }}>admin</Text> เพื่อเข้าหน้าผู้ดูแล หรือพิมพ์อะไรก็ได้เพื่อเข้าหน้านักศึกษา
            </Text>
          </View>

          {/* ========================================== */}
          {/* Login Form */}
          {/* ========================================== */}
          <View style={styles.formContainer}>
            
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>รหัสนักศึกษา / Username</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={username} 
                  onChangeText={setUsername} 
                  placeholder="กรอกรหัสนักศึกษา เช่น B6xxxxxx"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>รหัสผ่าน / Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholder="กรอกรหัสผ่าน"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordBtn} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerHintRow}>
              <Text style={styles.registerHintText}>ยังไม่มีบัญชีใช่หรือไม่? </Text>
              <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
                <Text style={styles.registerLinkText}>ลงทะเบียนที่นี่</Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// Styles
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: 'center', // ให้อยู่กึ่งกลางจอแนวตั้งถ้าจอยาว
  },

  // Header & Logo
  headerSection: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 110,
    height: 110,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 2,
  },
  appNameText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#F28C28',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Test Mode Banner
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF', // สีฟ้าพาสเทล
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E3A8A', // สีน้ำเงินเข้ม
    lineHeight: 20,
  },

  // Form Container
  formContainer: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    height: '100%',
  },

  // Forgot Password
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F28C28',
  },

  // Login Button
  loginBtn: {
    backgroundColor: '#F28C28',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F28C28',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // Register Link
  registerHintRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  registerHintText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F28C28',
  },
});