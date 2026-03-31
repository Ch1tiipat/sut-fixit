วิธีดึงโค้ด SUT FixIt ไปรันในเครื่องตัวเอง (สำหรับคนในทีม)
📌 สิ่งที่ต้องมีในเครื่องก่อนเริ่ม:

1.โปรแกรม VS Code, Node.js, และ Git (ติดตั้งลงในคอมพิวเตอร์ให้เรียบร้อย)

2.แอป Expo Go (โหลดติดมือถือไว้ ได้ทั้ง iOS และ Android)

🚀 ขั้นตอนการดึงโค้ดไปรัน (ทำทีละบรรทัดนะ):

1.สร้างโฟลเดอร์เปล่าๆ ไว้ที่ไหนก็ได้ในคอมพิวเตอร์ (เช่น ในไดรฟ์ D หรือหน้า Desktop) แล้วคลิกขวาเปิดโฟลเดอร์นั้นด้วย VS Code

2.ไปที่เมนู Terminal > New Terminal

3.พิมพ์คำสั่งดึงโค้ดจาก GitHub ของกลุ่มเรา (ก็อปปี้บรรทัดนี้ไปวางแล้วกด Enter):

git clone https://github.com/Ch1tiipat/sut-fixit.git

4.พิมพ์คำสั่งเพื่อย้ายเข้าไปในโฟลเดอร์โปรเจกต์:

cd sut-fixit

5.พิมพ์คำสั่งนี้เพื่อดาวน์โหลดไฟล์ระบบ node_modules กลับมา:

npm install

6.พิมพ์คำสั่งเพื่อรันเซิร์ฟเวอร์แอปพลิเคชัน:

npm install

npx expo install expo-location react-native-maps

npx expo install expo-image-picker

npx expo install react-native-chart-kit react-native-svg

npm install -g expo-cli

expo install react-native-chart-kit react-native-svg

npx expo start

**สำหรับเเก้ GPS ที่ไปปักหมุดที่อื่น**
ไปที่สามจุด -> setting -> location -> Search ใส่พิกัดเข้าไป -> save location
(setting location Fix: 14.8818, 102.0205 )

7.จะมี QR Code โผล่ขึ้นมาบนหน้าจอคอม
-ถ้าทำงานต่อ กด a จะเปิดเซิฟเวอร์ 
------------------------------------------------------------------------
เสริมตอนทำส่วนของตัวเองเสร็จแล้ว
ใช้ 3 คำสั่งนี้ (ทีละบรรทัด):
Bash
git add .
git commit -m "บอกสั้นๆ ว่าแก้หน้าไหนไป"
git push

------------------------------------------------------------------------

วิธีดึงโค้ด SUT FixIt ไปทำต่อ (สำหรับคนใช้ Android Studio)
ขั้นตอนการดึงโค้ดไปรัน (ทำทีละบรรทัดนะ):
1.สร้างโฟลเดอร์เปล่าๆ ไว้ที่ไหนก็ได้ แล้วคลิกขวาเปิดโฟลเดอร์นั้นด้วย VS Code
2.ไปที่เมนู Terminal > New Terminal
3.พิมพ์คำสั่งดึงโค้ด (ก็อปปี้ไปวางแล้วกด Enter):
git clone https://github.com/Ch1tiipat/sut-fixit.git
4.พิมพ์คำสั่งเพื่อย้ายเข้าไปในโฟลเดอร์โปรเจกต์:
cd sut-fixit
5.พิมพ์คำสั่งนี้เพื่อดาวน์โหลดไฟล์ระบบกลับมา:
npm install
6.เปิดโปรแกรม Android Studio ไปที่ Virtual Device Manager แล้วกดปุ่ม Play (▶️) เพื่อเปิดหน้าจอมือถือจำลองขึ้นมารอไว้เลย
7.กลับมาที่ VS Code พิมพ์คำสั่งรันเซิร์ฟเวอร์:
npx expo start
8.เมื่อ QR Code ขึ้นมา ให้กดปุ่มตัวอักษร a บนคีย์บอร์ด 1 ครั้ง เพื่อให้แอปเด้งไปเปิดบน Android Studio (ถ้ามีถามให้ติดตั้ง Expo Go ลงมือถือจำลอง ให้พิมพ์ y แล้วกด Enter)
