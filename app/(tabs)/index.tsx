import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// อิมพอร์ต Components ที่เราเพิ่งสร้างขึ้นมา
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🛠️</Text>
        <Text style={styles.logoText}>SUT FixIt</Text>
      </View>

      <Text style={styles.title}>Login</Text>

      {/* เรียกใช้ Component ช่องกรอกข้อมูล */}
      <CustomTextInput 
        label="ชื่อผู้ใช้งาน" 
        placeholder="รหัสนักศึกษา หรือ อีเมล" 
      />

      {/* เรียกใช้ Component ช่องกรอกข้อมูลแบบซ่อนรหัสผ่าน */}
      <CustomTextInput 
        label="รหัสผ่าน" 
        placeholder="กรอกรหัสผ่าน" 
        secureTextEntry={true} 
      />

      {/* เรียกใช้ Component ปุ่มกด */}
      <CustomButton 
        title="เข้าสู่ระบบ" 
        onPress={() => alert('กดปุ่มเข้าสู่ระบบแล้ว!')} 
      />

      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <Text style={styles.linkText}>สมัครสมาชิก</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>ลืมรหัสผ่าน?</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF7A00',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  linkText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});