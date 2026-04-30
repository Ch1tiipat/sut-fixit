// ไฟล์ constants/api.ts

// 1. จด IP ของแต่ละที่เก็บไว้เป็นตัวแปร (จะได้ไม่ต้องจำ)
const IP_MY_DORM = "192.168.1.167";   // IP หอตัวเอง
const IP_FRIEND_DORM = "192.168.1.48"; // IP หอเพื่อน (สมมติ)
const IP_UNIVERSITY = "10.0.110.216";      // IP มหาลัย (ถ้ามี)

// 2. ⚡ เลือกเปิดใช้ IP ปัจจุบัน (วิธีทำ: คอมเมนต์อันที่ไม่ได้ใช้)
 const CURRENT_IP = IP_MY_DORM;
//const CURRENT_IP = IP_FRIEND_DORM;     // <--- ตอนนี้อยู่หอเพื่อน ก็เปิดบรรทัดนี้
// const CURRENT_IP = IP_UNIVERSITY;

// 3. สร้างเป็น API_URL ส่งออกไปให้ทุกหน้าใช้งาน
export const API_URL = `http://${CURRENT_IP}:3000/api`;