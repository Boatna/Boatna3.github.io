document.getElementById("search-btn").addEventListener("click", function () {
    const query = document.getElementById("query").value.trim().toLowerCase(); // แปลงข้อความเป็นตัวพิมพ์เล็ก
    const resultArea = document.getElementById("result");
    const errorMessage = document.getElementById("error-message");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Clear previous results and errors
    resultArea.value = "";
    errorMessage.textContent = "";

    if (!query) {
        errorMessage.textContent = "กรุณากรอกข้อมูลที่ต้องการค้นหา";
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove("hidden");

    // Load Excel file
    fetch("employee-data.xlsx")
        .then((response) => response.arrayBuffer())
        .then((data) => {
            const workbook = XLSX.read(data, { type: "array" });

            let jsonData = [];
            
            // Loop through all sheets in the workbook
            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                
                // ตรวจสอบว่าแผ่นงานนั้นมีข้อมูลหรือไม่
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                if (sheetData.length > 0) {
                    console.log(`Data from sheet: ${sheetName}`, sheetData); // ตรวจสอบข้อมูลในแต่ละแผ่นงาน
                    jsonData = jsonData.concat(sheetData); // Combine data from all sheets
                } else {
                    console.log(`Sheet "${sheetName}" is empty.`);
                }
            });

            // Search in the JSON data
            const searchResults = jsonData.filter((row) => {
                const employeeId = (row["รหัสพนักงาน"] || "").toString().toLowerCase();
                const fullName = (row["ชื่อพนักงาน"] || "").toLowerCase();
                return employeeId.includes(query) || fullName.includes(query);
            });

            // Hide loading spinner
            loadingSpinner.classList.add("hidden");

            if (searchResults.length === 0) {
                errorMessage.textContent = "ไม่พบข้อมูลพนักงาน";
                return;
            }

            // Display results in text area
            const formattedResults = searchResults
                .map(
                    (row) =>
                        `${row["รหัสพนักงาน"] || "N/A"} / ${row["ชื่อพนักงาน"] || "N/A"} - ${row["แผนก"] || "N/A"} / ${row["โต๊ะที่นั่ง"] || "N/A"}`
                )
                .join("\n");

            resultArea.value = formattedResults;

            // Create a pop-up to show detailed information
            const popupContent = searchResults.map((row) => {
                return `
                    <h3>ข้อมูลพนักงาน</h3>
                    <p><strong>ชื่อ-นามสกุล:</strong> ${row["ชื่อพนักงาน"] || "N/A"}</p>
                    <p><strong>โต๊ะที่นั่ง:</strong> <span class="seat-table">${row["โต๊ะที่นั่ง"] || "N/A"}</span></p>
                `;
            }).join("");

            // Display the pop-up
            const popup = document.getElementById("popup");
            const popupTitle = document.getElementById("popup-title");
            const popupMessage = document.getElementById("popup-message");

            popupTitle.innerHTML = "ผลการค้นหาข้อมูลพนักงาน";
            popupMessage.innerHTML = popupContent;
            popup.classList.remove("hidden");

            // Close popup when the close button is clicked
            document.getElementById("popup-close").addEventListener("click", function () {
                popup.classList.add("hidden");
            });

        })
        .catch((error) => {
            console.error("Error loading Excel file:", error);
            errorMessage.textContent = "เกิดข้อผิดพลาดในการโหลดไฟล์ Excel";
            loadingSpinner.classList.add("hidden");
        });
});

const translations = {
    th: {
        title: "กรุณากรอกข้อมูลที่ต้องการค้นหา",
        placeholder: "กรอกข้อมูลค้นหา เช่น รหัสพนักงาน",
        search: "ค้นหา",
        loading: "กำลังโหลดข้อมูล...",
        result: "ผลลัพธ์",
        error: "ไม่พบข้อมูลพนักงาน",
        popup: {
            title: "รายละเอียดข้อมูล",
            details: {
                fullName: "ชื่อ-นามสกุล",
                desk: "โต๊ะที่นั่ง"
            }
        },
        footer: "© 2025 ระบบค้นหาข้อมูลพนักงาน | ติดต่อเรา"
    },
    en: {
        title: "Please enter the information you want to search for",
        placeholder: "Enter search information such as employee ID or name",
        search: "Search",
        loading: "Loading data...",
        result: "Results",
        error: "No employee data found",
        popup: {
            title: "Details Information",
            details: {
                fullName: "Full Name",
                desk: "Desk"
            }
        },
        footer: "© 2025 Employee Search System | Contact Us"
    },
    mm: {
        title: "ရှာဖွေရန်လိုအပ်သောအချက်အလက်ကိုထည့်ပါ",
        placeholder: "ရုံးဝန်ထမ်းအမှတ်သို့မဟုတ် အမည်ထည့်ပါ",
        search: "ရှာဖွေမည်",
        loading: "ဒေတာများကိုလွှတ်နေသည်...",
        result: "ရလဒ်များ",
        error: "၀န်ထမ်းအချက်အလက်ရှာမတွေ့ပါ",
        popup: {
            title: "အချက်အလက်အသေးစိတ်",
            details: {
                fullName: "အမည်အပြည့်အစုံ",
                desk: "စားပွဲ"
            }
        },
        footer: "© 2025 ၀န်ထမ်းရှာဖွေမှုစနစ် | ဆက်သွယ်ရန်"
    }
};
// เปลี่ยนข้อความในหน้าเว็บ
function changeLanguage(language) {
    document.querySelector("h1").textContent = translations[language].title;
    document.getElementById("query").placeholder = translations[language].placeholder;
    document.getElementById("search-btn").textContent = translations[language].search;
    document.getElementById("loading-spinner").textContent = translations[language].loading;
    document.getElementById("result").placeholder = translations[language].result;
    document.getElementById("error-message").textContent = translations[language].error;
    document.querySelector("footer p").innerHTML = translations[language].footer;
}

// เพิ่ม Event Listener ให้ Dropdown
document.getElementById("language-dropdown").addEventListener("change", function () {
    const selectedLang = this.value;
    changeLanguage(selectedLang);
});
function updatePopupContent(language, searchResults) {
    // เปลี่ยนหัวข้อในป๊อปอัป
    document.getElementById("popup-title").textContent = translations[language].popup.title;

    // เปลี่ยนข้อความในเนื้อหาป๊อปอัป
const popupContent = searchResults.map((row) => {
    return `
        <p><strong>${translations[language].popup.details.fullName}:</strong> ${row["ชื่อพนักงาน"] || "N/A"}</p>
        <p><strong>${translations[language].popup.details.desk}:</strong> <span class="seat-table">${row["โต๊ะที่นั่ง"] || "N/A"}</span></p>
    `;
}).join("");
}
// ใส่เนื้อหาในป๊อปอัป
document.getElementById("popup-message").innerHTML = popupContent;

document.getElementById("language-dropdown").addEventListener("change", function () {
    const selectedLang = this.value;
    changeLanguage(selectedLang);

    // ตัวอย่าง: อัปเดตป๊อปอัปเมื่อเปลี่ยนภาษา
    const dummyResults = [{ "ชื่อ-นามสกุล": "สมชาย ใจดี", "โต๊ะที่นั่ง": "A1" }];
    updatePopupContent(selectedLang, dummyResults);

});