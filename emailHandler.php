<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $employee_id = $_POST['employee_id'];
    $department = $_POST['department'];
    $course = $_POST['course'];

    $to = "admin@yourcompany.com"; // เปลี่ยนเป็นอีเมลผู้ดูแลระบบ
    $subject = "ข้อมูลการอบรมพนักงาน";
    $message = "
    มีข้อมูลใหม่จากระบบอบรมพนักงาน:
    ชื่อพนักงาน: $name
    รหัสพนักงาน: $employee_id
    แผนก: $department
    หลักสูตรที่อบรม: $course
    ";
    $headers = "From: no-reply@yourdomain.com";

    if (mail($to, $subject, $message, $headers)) {
        echo "ข้อมูลถูกส่งเรียบร้อย!";
    } else {
        echo "เกิดข้อผิดพลาดในการส่งอีเมล!";
    }
} else {
    echo "ไม่อนุญาตให้เข้าถึงหน้านี้โดยตรง!";
}
?>
