// ฟังก์ชันจัดการเมื่อผู้ใช้ส่งฟอร์ม
document.getElementById('trainingForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มโดยตรง

    // เก็บข้อมูลจากฟอร์ม
    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employee_id').value;
    const department = document.getElementById('department').value;
    const course = document.getElementById('course').value;
    const responseMessage = document.getElementById('responseMessage'); // ข้อความแสดงผล

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!name || !employeeId || !department || !course) {
        responseMessage.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน!';
        responseMessage.style.color = '#dc3545'; // สีแดงสำหรับข้อความผิดพลาด
        return;
    }

    // แสดงข้อความตอบรับ
    responseMessage.textContent = `ขอบคุณ, ${name} ที่ลงทะเบียนเข้าอบรมหลักสูตร ${course} เรียบร้อยแล้ว!`;
    responseMessage.style.color = '#28a745'; // สีเขียวสำหรับข้อความสำเร็จ

    // บันทึกข้อมูลผู้ใช้ใน Local Storage
    localStorage.setItem('userName', name);

    // เปลี่ยนหน้าไปยัง Home-page.html หลังจากแสดงข้อความ 2 วินาที
    setTimeout(function () {
        window.location.href = 'Home-page.html';
    }, 2000);
});

// ฟังก์ชันตรวจสอบสถานะผู้ใช้เมื่อโหลดหน้าเว็บ
window.addEventListener('load', () => {
    const savedName = localStorage.getItem('userName'); // ตรวจสอบข้อมูลใน Local Storage
    const userNameDisplay = document.getElementById('userName');
    const logoutButton = document.getElementById('logoutButton');
    const registrationForm = document.getElementById('trainingForm');

    if (savedName) {
        userNameDisplay.textContent = `ยินดีต้อนรับ, ${savedName}`;
        logoutButton.style.display = 'inline-block'; // แสดงปุ่มออกจากระบบ
        registrationForm.style.display = 'none'; // ซ่อนฟอร์มลงทะเบียน
    }
});

// ฟังก์ชันออกจากระบบ
function logout() {
    // ลบข้อมูลใน Local Storage
    localStorage.removeItem('userName');

    // รีเซ็ตหน้า
    document.getElementById('userName').textContent = '';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('trainingForm').style.display = 'block';
    document.getElementById('responseMessage').textContent = '';
}
