// นำเข้าฟังก์ชันพื้นฐานที่จำเป็นจาก Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // ปิดระบบ Storage ไว้ก่อนตามที่เราคุยกันครับ

// ข้อมูลกุญแจเชื่อมต่อโปรเจกต์ SUT FixIt ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBa4R2tKYONQUlXJQCEeFFN7bDuPGKc_yM",
  authDomain: "sut-fixit.firebaseapp.com",
  projectId: "sut-fixit",
  storageBucket: "sut-fixit.firebasestorage.app",
  messagingSenderId: "970010466359",
  appId: "1:970010466359:web:a97e92fd952242fcb0c7b2"
};

// สั่งให้ Firebase เริ่มต้นทำงานด้วยกุญแจด้านบน
const app = initializeApp(firebaseConfig);

// สร้างตัวแปรส่งออก (Export) เพื่อให้หน้าจออื่นๆ ในแอปดึงไปใช้งานได้เลย
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app); 

console.log("Firebase เชื่อมต่อสำเร็จแล้ว!");
