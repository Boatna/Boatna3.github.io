form.addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มโดยตรง

    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const department = document.getElementById('department').value;
    const course = document.getElementById('course').value;

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
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('userName').textContent = `ยินดีต้อนรับ, ${savedName}`;
        document.getElementById('logoutButton').style.display = 'inline-block';
        document.getElementById('registrationForm').style.display = 'none';
    }
});

// เมื่อผู้ใช้ส่งฟอร์มลงทะเบียน
document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    // เก็บข้อมูลฟอร์ม
    const formData = {
        name: document.getElementById('name').value,
        employeeId: document.getElementById('employeeId').value,
        department: document.getElementById('department').value,
        course: document.getElementById('course').value,
    };

    // ตรวจสอบการกรอกข้อมูล
    if (!formData.name || !formData.employeeId || !formData.department || !formData.course) {
        document.getElementById('responseMessage').textContent = "กรุณากรอกข้อมูลให้ครบถ้วน!";
        document.getElementById('responseMessage').style.color = 'red';
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        // แสดงข้อความสำเร็จ
        if (response.ok) {
            document.getElementById('responseMessage').innerText = result.message || "ลงทะเบียนสำเร็จ!";
            document.getElementById('responseMessage').style.color = 'green';

            // บันทึกชื่อผู้ใช้ใน Local Storage
            localStorage.setItem('userName', formData.name);

            // เปลี่ยนเส้นทางไปยัง Home-page.html
            window.location.href = 'Home-page.html';
        } else {
            document.getElementById('responseMessage').innerText = result.message || "เกิดข้อผิดพลาด!";
            document.getElementById('responseMessage').style.color = 'red';
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('responseMessage').innerText = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์!";
        document.getElementById('responseMessage').style.color = 'red';
    }
});

// ฟังก์ชันออกจากระบบ
function logout() {
    // ลบข้อมูลใน Local Storage
    localStorage.removeItem('userName');

    // รีเซ็ตหน้า
    document.getElementById('userName').textContent = '';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('responseMessage').textContent = '';
}
