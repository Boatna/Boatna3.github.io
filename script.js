form.addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มโดยตรง

    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const department = document.getElementById('department').value;
    const course = document.getElementById('course').value;
    const responseMessage = document.getElementById('responseMessage'); // เพิ่มตัวแปรข้อความตอบกลับ

    if (name && employeeId && department && course) {
        // แสดงข้อความตอบรับ
        responseMessage.textContent = `ขอบคุณ, ${name} ที่ลงทะเบียนเข้าอบรมหลักสูตร ${course} เรียบร้อยแล้ว!`;
        responseMessage.style.color = '#28a745'; // สีเขียวสำหรับข้อความสำเร็จ

        // เปลี่ยนหน้าไปยัง Home-page.html
        setTimeout(function() {
            window.location.href = 'Home-page.html';
        }, 2000); // ใช้เวลา 2 วินาทีหลังจากแสดงข้อความเพื่อเปลี่ยนหน้า
    } else {
        responseMessage.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน';
        responseMessage.style.color = '#dc3545'; // สีแดงสำหรับข้อความผิดพลาด
    }
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
