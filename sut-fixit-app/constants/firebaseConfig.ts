// นำเข้าฟังก์ชันพื้นฐานที่จำเป็นจาก Firebase SDK
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
// @ts-ignore: ปิดแจ้งเตือนบั๊ก TypeScript ของ Firebase
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// อ่านค่าเชื่อมต่อโปรเจกต์จาก environment variables (ไฟล์ .env.local)
//
// ⚠️ หมายเหตุสำคัญ: ตัวแปร EXPO_PUBLIC_* จะถูกฝังลงใน JS bundle ตอน build
// ดังนั้นค่าพวกนี้ "ไม่ใช่ความลับ" — ใครแกะ APK ก็เห็นได้ ซึ่งเป็นเรื่องปกติของ
// Firebase web config อยู่แล้ว สิ่งที่ป้องกันการใช้งานผิดจริง ๆ คือ
// Firebase Security Rules และการจำกัด API key ใน Google Cloud Console
//
// ต้องเขียน process.env.EXPO_PUBLIC_XXX แบบเต็ม ๆ เท่านั้น เพราะ Expo แทนค่า
// ด้วยการ replace ข้อความตอน build — เขียนแบบ process.env[key] จะได้ undefined
const firebaseEnv = {
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 🛑 ตรวจสอบตอน runtime ว่ามีตัวแปรไหนหายไปบ้าง แล้วบอกชื่อให้ครบ
const missingEnvVars = Object.entries(firebaseEnv)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnvVars.length > 0) {
  throw new Error(
    `[firebaseConfig] ตั้งค่า Firebase ไม่สำเร็จ เพราะขาด environment variables ต่อไปนี้:\n` +
    missingEnvVars.map((name) => `  - ${name}`).join('\n') +
    `\n\nวิธีแก้: คัดลอกไฟล์ .env.example เป็น .env.local แล้วใส่ค่าจริงให้ครบ` +
    `\nจากนั้นรีสตาร์ท Expo พร้อมล้าง cache ด้วยคำสั่ง: npx expo start -c`
  );
}

// ข้อมูลกุญแจเชื่อมต่อโปรเจกต์ SUT FixIt
const firebaseConfig = {
  apiKey: firebaseEnv.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: firebaseEnv.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseEnv.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: firebaseEnv.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseEnv.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseEnv.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// สั่งให้ Firebase เริ่มต้นทำงานด้วยกุญแจด้านบน
const app = initializeApp(firebaseConfig);

// 🚀 สร้างตัวแปร Auth โดยสั่งให้จำการล็อกอินฝังไว้ในเครื่อง (AsyncStorage)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// สร้างตัวแปร Database และ Storage
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase เชื่อมต่อและตั้งค่าการจำล็อกอินสำเร็จแล้ว!");

// ✅ ส่งออก (Export) ตัวแปรทั้งหมดไปให้หน้าจออื่นๆ ในแอปดึงไปใช้งาน
export { auth, db, storage, app };
