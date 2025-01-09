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
                        `${row["รหัสพนักงาน"] || "N/A"} / ${row["ชื่อพนักงาน"] || "N/A"} - ${row["หน่วยงาน"] || "N/A"} / ${row["โต๊ะที่นั่ง"] || "N/A"}`
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
document.addEventListener("DOMContentLoaded", () => {
    const mainTitle = document.querySelector("h1");
    const queryInput = document.getElementById("query");
    const searchButton = document.getElementById("search-btn");
    const languageIcon = document.getElementById("language-icon");
    const languageDropdown = document.getElementById("language-dropdown");
    const errorMessage = document.getElementById("error-message");
    const resultArea = document.getElementById("result");
    const loadingSpinner = document.getElementById("loading-spinner");
    const footerText = document.getElementById("footer-text");
    const contactLink = document.getElementById("contact-link");

    // เก็บข้อความแปลใน object
    const translations = {
        th: {
            title: "กรุณากรอกข้อมูลที่ต้องการค้นหา",
            searchPlaceholder: "กรอกข้อมูลค้นหา เช่น รหัสพนักงาน",
            searchButton: "ค้นหา",
            contactLinkText: "© 2025 ระบบค้นหาข้อมูลพนักงาน | ติดต่อเรา",
            errorMessage: "กรุณากรอกคำค้นหา",
            loadingMessage: "กำลังโหลดข้อมูล...",
            resultTitle: "ผลการค้นหา:",
            
        },
        en: {
            title: "Please enter the information you want to search",
            searchPlaceholder: "Enter search information, e.g., Employee ID",
            searchButton: "Search",
            contactLinkText: "© 2025 Employee Search System | Contact Us",
            errorMessage: "Please enter a search query",
            loadingMessage: "Loading data...",
            resultTitle: "Search Results:",
        },
    };

    const changeLanguage = (lang) => {
        const translation = translations[lang];
        if (translation) {
            mainTitle.textContent = translation.title;
            queryInput.placeholder = translation.searchPlaceholder;
            searchButton.textContent = translation.searchButton;
            footerText.innerHTML = translation.footer;
            errorMessage.textContent = ""; // เคลียร์ข้อความเก่า
        }
    };

    // คลิกที่ไอคอนเปลี่ยนภาษา
    languageIcon.addEventListener("click", () => {
        languageDropdown.style.display =
            languageDropdown.style.display === "block" ? "none" : "block";
    });

    // เลือกภาษาใน dropdown
    languageDropdown.addEventListener("click", (e) => {
        const lang = e.target.dataset.lang;
        if (lang) {
            changeLanguage(lang);
            languageDropdown.style.display = "none";
        }
    });

    // ฟังก์ชันการค้นหา (ตัวอย่างสมมุติ)
    searchButton.addEventListener("click", () => {
        const query = queryInput.value.trim();
        if (!query) {
            errorMessage.textContent = "กรุณากรอกคำค้นหา";
            return;
        }

        errorMessage.textContent = "";
        resultArea.value = "";
        loadingSpinner.classList.remove("hidden");
    });
});
