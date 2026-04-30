# 🔧 SUT FixIt
### ระบบแอปพลิเคชันจัดการงานซ่อมบำรุงหอพัก — มหาวิทยาลัยเทคโนโลยีสุรนารี

แอปพลิเคชันมือถือ (Android) สำหรับนักศึกษาผู้พักอาศัย ช่างซ่อมบำรุง และผู้ดูแลระบบ  
เพื่อแจ้งซ่อม ติดตามสถานะ และบริหารงานซ่อมบำรุงหอพักแบบ Real-time

> รายวิชา 1101103 โครงงานการพัฒนาโปรแกรมประยุกต์ด้วยภาษาสคริปต์  
> ภาคการศึกษาที่ 3 ปีการศึกษา 2568 · สาขาวิชาเทคโนโลยีดิจิทัล SUT

---

## 👥 ทีมพัฒนา

| รหัสนักศึกษา | ชื่อ-นามสกุล |
|---|---|
| B6701635 | นายกิตติภัทร์ จันทศิลา |
| B6702861 | นายนฤเบศ แสงประทุม |
| B6703165 | นายวิธวินท์ ระวังจังหรีด |
| B6703271 | นายชิติพัทธ์ สีสุด |
| B6703370 | นายวีรฉัตร จินะปริวัตอาภรณ์ |

---

## 📋 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [ผู้ใช้งาน 3 กลุ่มและฟีเจอร์](#-ผู้ใช้งาน-3-กลุ่มและฟีเจอร์)
- [Tech Stack](#-tech-stack)
- [Dependencies ทั้งหมด (package.json)](#-dependencies-ทั้งหมด-packagejson)
- [โครงสร้างฐานข้อมูล (Firestore)](#-โครงสร้างฐานข้อมูล-firestore)
- [ความต้องการของระบบก่อนติดตั้ง](#-ความต้องการของระบบก่อนติดตั้ง)
- [การติดตั้งและตั้งค่า](#-การติดตั้งและตั้งค่า)
- [การตั้งค่า Firebase](#-การตั้งค่า-firebase)
- [การรันโปรเจกต์](#-การรันโปรเจกต์)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [Reusable Components](#-reusable-components)
- [หมายเหตุสำหรับทีม Dev](#-หมายเหตุสำหรับทีม-dev)

---

## 🎯 ภาพรวมโปรเจกต์

SUT FixIt แก้ปัญหากระบวนการแจ้งซ่อมแบบเดิมที่อาศัยกระดาษหรือ Line/Facebook ซึ่งทำให้ข้อมูลตกหล่น ไม่มีระบบติดตาม และช่างหาห้องไม่พบ

แอปนี้ทำหน้าที่เป็น **ศูนย์กลาง** ให้นักศึกษาแจ้งปัญหาพร้อมรูปถ่ายและพิกัด GPS ช่างรับงานพร้อมนำทาง และ Admin ดู Dashboard สถิติเพื่อบริหารทรัพยากรได้อย่างมีประสิทธิภาพ

---

## 👤 ผู้ใช้งาน 3 กลุ่มและฟีเจอร์

### 🎓 นักศึกษา (Student)
- **Auth:** Login / Register / Reset Password / Delete Account
- **แจ้งซ่อม:** เลือกหอพัก-เลขห้องผ่าน Dropdown, เลือกหมวดหมู่ปัญหา (ประปา/ไฟฟ้า/เฟอร์นิเจอร์/อื่นๆ), พิมพ์รายละเอียด, แนบรูปถ่ายผ่านกล้อง (Camera Sensor), ปักหมุดพิกัดผ่าน GPS
- **ติดตาม:** ดูสถานะ Real-time (รอดำเนินการ / กำลังซ่อม / เสร็จสมบูรณ์), ดูแผนที่ติดตามช่าง (Order Tracking)
- **ประวัติ:** ดูรายการแจ้งซ่อมย้อนหลังทั้งหมด
- **รีวิว:** ให้คะแนน 1-5 ดาว (ความพึงพอใจ + ความรวดเร็ว) พร้อมข้อเสนอแนะ แก้ไขได้ภายใน 24 ชั่วโมง
- **พิเศษ:** เขย่าเครื่อง (Accelerometer Sensor) เพื่อแจ้งซ่อมฉุกเฉิน

### 🔨 ช่างซ่อมบำรุง (Technician)
- **คิวงาน:** ดูรายการงานที่ถูกมอบหมาย แบ่งตามสถานะ (เร่งด่วน / ปกติ / เสร็จแล้ว)
- **รับงาน:** กดรับงาน → ระบบส่ง Notification ไปยังนักศึกษาอัตโนมัติ
- **นำทาง:** ดูแผนที่พิกัด GPS และเส้นทางไปยังจุดซ่อม
- **ส่งงาน:** ถ่ายภาพ "ก่อนซ่อม" และ "หลังซ่อม" + กรอกค่าวัสดุอุปกรณ์ → ส่งเข้าระบบ QC
- **สถิติส่วนตัว:** ดูจำนวนงานที่ทำสำเร็จ, คะแนนเฉลี่ย (Rating), กราฟสรุปรายเดือน

### ⚙️ ผู้ดูแลระบบ (Admin)
- **Dashboard:** กราฟสถิติรวม (จำนวนคำร้อง, งานเสร็จ, สัดส่วนประเภท, กราฟรายเดือน)
- **Ranking:** หอพักที่แจ้งซ่อมบ่อยที่สุด, ช่างที่ทำงานมากที่สุด + คะแนน KPI
- **จัดการคำร้อง:** ดูรายการทั้งหมด, กรองตามหอพัก/หมวดหมู่/วันที่, ลบคำร้องที่ซ้ำหรือเท็จ
- **ตรวจงาน (QC):** ดูรูปเปรียบเทียบก่อน-หลัง → กดอนุมัติปิดงาน (Completed)
- **จัดการรีวิว:** ลบคอมเมนต์ที่เป็น spam หรือข้อมูลเท็จ

---

## 🛠 Tech Stack

| หมวดหมู่ | เทคโนโลยี | เวอร์ชัน |
|---|---|---|
| Framework | React Native + Expo | 54.0.33 |
| Routing | Expo Router | ~6.0.23 |
| ภาษา | TypeScript | ~5.9.2 |
| Backend / DB | Firebase Firestore | ^12.11.0 |
| Authentication | Firebase Auth | ^12.11.0 |
| File Storage | Firebase Storage | ^12.11.0 |
| Navigation | React Navigation (Bottom Tabs) | ^7.x |
| แผนที่ | react-native-maps | 1.20.1 |
| กราฟ/สถิติ | react-native-chart-kit | ^6.12.0 |
| Animation | react-native-reanimated | ~4.1.1 |
| Gesture | react-native-gesture-handler | ~2.28.0 |

---

## 📦 Dependencies ทั้งหมด (package.json)

อธิบายทุก package ว่าใช้ทำอะไรในโปรเจกต์นี้:

### 🔥 Firebase
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `firebase` | ^12.11.0 | Core Firebase SDK — ครอบคลุม Firestore (DB), Auth, Storage และ Cloud Messaging ทั้งหมด |

### 🗺️ Maps & Location
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `react-native-maps` | 1.20.1 | แสดงแผนที่ปักหมุดตำแหน่งแจ้งซ่อม, เส้นทางนำทางช่าง (Order Tracking) |
| `expo-location` | ~19.0.8 | อ่านพิกัด GPS ปัจจุบันของผู้ใช้ขณะแจ้งซ่อม |

### 📷 Camera & Media
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `expo-image-picker` | ~17.0.10 | เปิดกล้องหรือเลือกรูปจาก Gallery เพื่อแนบภาพประกอบคำร้อง และภาพก่อน/หลังซ่อมของช่าง |
| `expo-image` | ~3.0.11 | แสดงรูปภาพแบบ optimized พร้อม cache (ใช้แทน `<Image>` ปกติ เพื่อ performance ที่ดีกว่า) |
| `expo-file-system` | ~19.0.21 | จัดการไฟล์ในเครื่อง เช่น อ่าน path รูปภาพก่อน upload ขึ้น Firebase Storage |

### 📊 Charts & Graphics
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `react-native-chart-kit` | ^6.12.0 | วาดกราฟในหน้า Dashboard ของ Admin และหน้าสถิติช่าง (Bar Chart, Pie Chart, Line Graph) |
| `react-native-svg` | 15.12.1 | dependency บังคับของ chart-kit — ใช้ render กราฟในรูปแบบ SVG (ต้องติดตั้งคู่กันเสมอ) |

### 🎨 UI & Navigation
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `@react-navigation/native` | ^7.1.8 | Core navigation สำหรับการเปลี่ยนหน้าจอทั้งหมด |
| `@react-navigation/bottom-tabs` | ^7.4.0 | Bottom Navigation Bar (Home / History / Notification / Profile) ของทั้ง 3 กลุ่มผู้ใช้ |
| `@react-navigation/elements` | ^2.6.3 | UI elements พื้นฐานสำหรับ Navigation (Header, Back button ฯลฯ) |
| `expo-router` | ~6.0.23 | File-based routing บน Expo — จัดการ route ทุกหน้าผ่านโครงสร้าง folder ใน `app/` |
| `@expo/vector-icons` | ^15.0.3 | ไอคอนสำเร็จรูป (Ionicons, MaterialIcons ฯลฯ) ใช้ใน Navigation Bar และ UI ทั่วไป |
| `expo-symbols` | ~1.0.8 | SF Symbols สำหรับ icon เพิ่มเติม |

### ✨ Animation & Interaction
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `react-native-reanimated` | ~4.1.1 | Animation ลื่นไหล เช่น transition เปลี่ยนหน้า, animation การอัปเดตสถานะงาน |
| `react-native-worklets` | 0.5.1 | dependency บังคับของ reanimated — รัน animation บน UI thread แยกต่างหาก (ไม่ต้อง import ใช้เอง) |
| `react-native-gesture-handler` | ~2.28.0 | Gesture recognition (Swipe, Long Press) เช่น swipe ลบรายการ หรือ pull-to-refresh |
| `expo-haptics` | ~15.0.8 | Haptic feedback (การสั่นของเครื่อง) เมื่อกดปุ่มสำคัญ เช่น ส่งคำร้อง หรือยืนยันการลบ |

### 🔔 System & Utilities
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `expo-constants` | ~18.0.13 | อ่านค่า config จาก `app.json` และ environment variables (เช่น Firebase config) |
| `expo-font` | ~14.0.11 | โหลด custom font ตอน Splash Screen |
| `expo-linking` | ~8.0.11 | Deep link — เปิดแอปจาก URL หรือ Notification |
| `expo-splash-screen` | ~31.0.13 | ควบคุม Splash Screen ให้ค้างจนโหลด asset และ Firebase เสร็จก่อนแสดงหน้าแรก |
| `expo-status-bar` | ~3.0.9 | จัดการสี Status Bar ให้เข้ากับแต่ละหน้าจอ |
| `expo-system-ui` | ~6.0.9 | ตั้งค่า Background color ของ System UI (Android Navigation Bar) |
| `expo-web-browser` | ~15.0.10 | เปิด WebView ในแอป (ถ้ามีลิงก์ภายนอก) |
| `react-native-safe-area-context` | ~5.6.0 | จัดการ Safe Area (Notch/Status Bar) ให้ UI ไม่ถูกบัง |
| `react-native-screens` | ~4.16.0 | Optimize Native Screens — ลด memory ตอน navigate ระหว่างหน้า |

### 🌐 Web Support (Expo Web — ใช้ dev/testing เท่านั้น)
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `react-native-web` | ~0.21.0 | ให้ React Native รันบน Web Browser ได้ |
| `react-dom` | 19.1.0 | dependency ของ react-native-web |

### 🛠 DevDependencies
| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `typescript` | ~5.9.2 | Type safety ทั้งโปรเจกต์ |
| `@types/react` | ~19.1.0 | Type definitions สำหรับ React |
| `eslint` | ^9.25.0 | ตรวจสอบ code style และ error ก่อน commit |
| `eslint-config-expo` | ~10.0.0 | ESLint rules ที่ Expo แนะนำสำหรับ React Native |

---

## 🗄 โครงสร้างฐานข้อมูล (Firestore)

โปรเจกต์นี้ใช้ Firebase Firestore โดยมี Collection หลัก 3 ชุด:

```
Firestore
├── users/                        # ข้อมูลผู้ใช้ทุก role
│   └── {userId}
│       ├── name, email, phone
│       ├── role: "student" | "technician" | "admin"
│       ├── dormitory, roomNumber  # (เฉพาะ student)
│       └── profileImage (URL)
│
├── maintenance_requests/         # คำร้องแจ้งซ่อมทั้งหมด
│   └── {requestId}
│       ├── requestNumber: "#SUT-XXXX"
│       ├── studentId, technicianId
│       ├── dormitory, roomNumber
│       ├── category: "ประปา" | "ไฟฟ้า" | "เฟอร์นิเจอร์" | "อื่นๆ"
│       ├── description
│       ├── status: "pending" | "in_progress" | "completed" | "cancelled"
│       ├── priority: "urgent" | "normal"
│       ├── location: { lat, lng }
│       ├── images_before: [URL]
│       ├── images_after: [URL]
│       ├── material_cost: number
│       └── timestamps: { created, accepted, completed }
│
└── reviews_and_stats/            # รีวิวและสถิติการทำงาน
    └── {reviewId}
        ├── requestId, studentId, technicianId
        ├── rating_satisfaction: 1-5
        ├── rating_speed: 1-5
        ├── comment
        ├── created_at
        └── edited_at             # แก้ไขได้ภายใน 24 ชม.
```

---

## 💻 ความต้องการของระบบก่อนติดตั้ง

| โปรแกรม | เวอร์ชันขั้นต่ำ | หมายเหตุ |
|---|---|---|
| Node.js | >= 18.0.0 | https://nodejs.org |
| npm | >= 9.0.0 | มาพร้อม Node.js |
| Git | ล่าสุด | https://git-scm.com |
| Android Studio | ล่าสุด | สำหรับรัน Android Emulator |
| JDK | >= 17 | มาพร้อมกับ Android Studio |
| Expo Go (มือถือ) | ล่าสุด | ทดสอบบนเครื่องจริงผ่าน QR Code |

> **หมายเหตุ:** โปรเจกต์นี้พัฒนาสำหรับ **Android เท่านั้น** ตามขอบเขตโครงงาน

---

## 🚀 การติดตั้งและตั้งค่า

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/kraveerachat/SUT-Fix-App.git
cd SUT-Fix-App
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

> ⚠️ ถ้าเจอ warning เรื่อง peer dependencies ให้รัน `npm install --legacy-peer-deps`

### 3. ตั้งค่าไฟล์ Environment

สร้างไฟล์ `.env` ที่ root:

```bash
cp .env.example .env
```

กรอก Firebase config (ดูหัวข้อถัดไป):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

> ตัวแปรที่ขึ้นต้นด้วย `EXPO_PUBLIC_` จะถูก Expo Router expose ให้ client-side โดยอัตโนมัติ

---

## 🔥 การตั้งค่า Firebase

### 1. สร้างโปรเจกต์

1. ไปที่ [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. ตั้งชื่อ (เช่น `sut-fixit`) → Create

### 2. เพิ่มแอป Android

1. คลิกไอคอน Android → กรอก Package name: `com.sut.fixit`
2. ดาวน์โหลด `google-services.json` → วางที่ `android/app/google-services.json`

### 3. เปิดใช้งาน Services ที่จำเป็น

| Service | วิธีเปิด | ใช้ทำอะไรในแอป |
|---|---|---|
| **Authentication** | Build → Authentication → Sign-in method | Login/Register ด้วย Email+Password |
| **Firestore Database** | Build → Firestore → Create database | เก็บข้อมูล users, requests, reviews |
| **Storage** | Build → Storage → Get started | เก็บรูปภาพก่อน/หลังซ่อมและ profile |
| **Cloud Messaging (FCM)** | Build → Messaging | Push Notification แจ้งสถานะงาน |

### 4. Firestore Security Rules (เบื้องต้น)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /maintenance_requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null; // จำกัด role ใน app logic
    }

    match /reviews_and_stats/{reviewId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null
        && request.auth.uid == request.resource.data.studentId;
    }
  }
}
```

### 5. Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /requests/{requestId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /profiles/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Google Maps API Key (สำหรับ react-native-maps)

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. สร้าง API Key → เปิดใช้ **Maps SDK for Android**
3. ใส่ใน `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

---

## ▶️ การรันโปรเจกต์

### รันด้วย Expo Go (เร็วที่สุด — แนะนำสำหรับ Dev)

```bash
npx expo start
```

- สแกน QR Code ด้วยแอป **Expo Go** บนมือถือ Android
- กด `a` เพื่อเปิดบน Android Emulator (ต้องเปิด Android Studio ก่อน)

### รันบน Android Emulator โดยตรง

```bash
npm run android
# หรือ
npx expo start --android
```

### Clear Cache (ถ้าแอปค้างหรือมีปัญหา)

```bash
npx expo start --clear
```

---

## 📁 โครงสร้างโปรเจกต์

```
SUT-Fix-App/
├── app/                          # Expo Router — ทุก file = 1 route
│   ├── (auth)/                   # หน้า Login, Register, Reset Password
│   ├── (student)/                # หน้าจอกลุ่มนักศึกษา
│   │   ├── index.tsx             # Home (My Active Requests)
│   │   ├── report.tsx            # ฟอร์มแจ้งซ่อม
│   │   ├── tracking.tsx          # แผนที่ติดตามช่าง
│   │   ├── history.tsx           # ประวัติการแจ้งซ่อม
│   │   └── profile.tsx           # โปรไฟล์ + ลบบัญชี
│   ├── (technician)/             # หน้าจอกลุ่มช่างซ่อม
│   │   ├── index.tsx             # คิวงาน
│   │   ├── job-detail.tsx        # รายละเอียดงาน + แผนที่นำทาง
│   │   ├── submit-job.tsx        # ส่งงาน (อัปโหลดรูปก่อน/หลัง)
│   │   └── stats.tsx             # สถิติการทำงาน
│   ├── (admin)/                  # หน้าจอกลุ่ม Admin
│   │   ├── dashboard.tsx         # Dashboard สถิติรวม
│   │   ├── requests.tsx          # รายการคำร้องทั้งหมด + filter
│   │   └── qc.tsx                # ตรวจสอบงาน (QC) ก่อนปิดงาน
│   └── _layout.tsx               # Root layout
│
├── components/                   # Reusable Components
│   ├── StatusBadge.tsx
│   ├── TaskCard.tsx
│   ├── ImagePickerButton.tsx
│   ├── CustomTextInput.tsx
│   ├── CustomButton.tsx
│   ├── ConfirmationModal.tsx
│   ├── DropdownPicker.tsx
│   └── BottomNavBar.tsx
│
├── services/                     # Firebase service functions
│   ├── authService.ts
│   ├── requestService.ts
│   ├── storageService.ts
│   └── reviewService.ts
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useLocation.ts
│   └── useAccelerometer.ts       # shake-to-report
│
├── constants/                    # ค่าคงที่ (สีธีม, หมวดหมู่, รายชื่อหอพัก)
├── assets/                       # รูปภาพ, ไอคอน, ฟอนต์
├── firebase.ts                   # Firebase initialization
├── .env                          # Environment variables (ไม่ commit!)
├── .env.example                  # ตัวอย่าง env สำหรับ setup ใหม่
├── app.json                      # Expo config + Google Maps API Key
├── package.json
└── tsconfig.json
```

---

## 🧩 Reusable Components

Components ที่ใช้ร่วมกันข้าม screen ทั้ง 3 กลุ่มผู้ใช้:

| Component | ใช้ทำอะไร |
|---|---|
| `StatusBadge` | ป้ายแสดงสถานะงาน (เร่งด่วน/กำลังซ่อม/เสร็จแล้ว) พร้อมสีตามสถานะ |
| `TaskCard` | การ์ดแสดงรายการแจ้งซ่อม แสดงหอพัก ห้อง ประเภทปัญหา และวันที่ |
| `ImagePickerButton` | ปุ่มเปิดกล้อง/Gallery ผ่าน `expo-image-picker` |
| `CustomTextInput` | Text input มาตรฐานของแอป พร้อม label และ error state |
| `CustomButton` | ปุ่มสีส้ม (primary) มาตรฐานทั้งแอป |
| `ConfirmationModal` | Dialog ยืนยัน เช่น ยืนยันลบบัญชี หรือยกเลิกคำร้อง |
| `DropdownPicker` | Dropdown เลือกหอพัก, เลขห้อง, หมวดหมู่ปัญหา |
| `BottomNavBar` | Bottom Navigation Bar แยกตาม role (Student 4 tab / Technician 4 tab / Admin 5 tab) |

---

## ⚠️ หมายเหตุสำหรับทีม Dev

- **ห้าม commit** ไฟล์ `.env` และ `google-services.json` ขึ้น Git เด็ดขาด (มีใน `.gitignore` แล้ว)
- Firebase SDK เวอร์ชัน `^12.x` ใช้ **Modular API** เท่านั้น เช่น `import { getFirestore } from 'firebase/firestore'` — ไม่ใช้ Compat API แบบเก่า (`firebase/compat/...`)
- `react-native-maps` ต้องการ **Google Maps API Key** แยกต่างหาก (ไม่ใช่ key เดียวกับ Firebase) — ใส่ใน `app.json`
- `expo-location` ต้องขอ permission ก่อนใช้เสมอ: `await Location.requestForegroundPermissionsAsync()`
- `expo-image-picker` ต้องขอ permission กล้องและ gallery ก่อนเช่นกัน: `await ImagePicker.requestCameraPermissionsAsync()`
- `react-native-worklets` เป็น dependency ของ `react-native-reanimated` — ติดตั้งมาให้อัตโนมัติ ไม่ต้อง import ใช้เอง
- `react-native-svg` เป็น dependency ของ `react-native-chart-kit` — ต้องมีทั้งคู่จึงจะ render กราฟได้