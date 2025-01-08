let employeeData = [];

// ฟังก์ชันโหลดข้อมูล Excel
function fetchExcelData() {
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden");

    const url = "https://boatna.github.io/Boatna3.github.io/employee-data.xlsx";

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            employeeData = XLSX.utils.sheet_to_json(worksheet);
            console.log("ข้อมูลพนักงานที่โหลดมา:", employeeData);

            // Hide the loading spinner once the data is loaded
            loadingSpinner.classList.add("hidden");
        })
        .catch(err => {
            showPopup("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่ในภายหลัง");
            console.error(err);
            loadingSpinner.classList.add("hidden");  // Hide spinner on error
        });
}

// ฟังก์ชันค้นหาข้อมูล
function searchData() {
    const searchInput = document.getElementById("query").value.toLowerCase();

    if (employeeData.length === 0) {
        showPopup("ข้อผิดพลาด", "ข้อมูลยังไม่ถูกโหลด กรุณาลองใหม่ในภายหลัง");
        return;
    }

    // ค้นหาข้อมูลที่ตรงกับคำค้นหา
    let result = employeeData.filter(emp => {
        return (
            (emp['รหัสพนักงาน'] && emp['รหัสพนักงาน'].toString().toLowerCase().includes(searchInput)) ||
            (emp['ชื่อ-นามสกุล'] && emp['ชื่อ-นามสกุล'].toLowerCase().includes(searchInput)) ||
            (emp['แผนก'] && emp['แผนก'].toLowerCase().includes(searchInput)) ||
            (emp['โต๊ะที่นั่ง'] && emp['โต๊ะที่นั่ง'].toString().toLowerCase().includes(searchInput))
        );
    });

    if (result.length > 0) {
        let emp = result[0]; // แสดงเฉพาะข้อมูลแรก
        showPopup(
            "ผลการค้นหา",
            `รหัสพนักงาน: ${emp['รหัสพนักงาน']}<br>` +
            `ชื่อ-นามสกุล: ${emp['ชื่อ-นามสกุล']}<br>` +
            `แผนก: ${emp['แผนก']}<br>` +
            `โต๊ะที่นั่ง: ${emp['โต๊ะที่นั่ง']}`
        );
    } else {
        showPopup("ผลการค้นหา", "ไม่พบข้อมูลที่ตรงกับคำค้นหา");
    }
}

// ฟังก์ชันแสดงป๊อปอัป
function showPopup(title, message) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupMessage = document.getElementById("popup-message");

    popupTitle.innerHTML = title;
    popupMessage.innerHTML = message;
    popup.classList.remove("hidden");
}

// ฟังก์ชันปิดป๊อปอัป
document.getElementById("popup-close").onclick = function () {
    document.getElementById("popup").classList.add("hidden");
};

// โหลดข้อมูล Excel เมื่อเปิดหน้า
fetchExcelData();
