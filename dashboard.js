document.addEventListener("DOMContentLoaded", function () {


    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------

    const currentStaff =
        JSON.parse(localStorage.getItem("currentStaff"));


    if (!currentStaff) {

        window.location.href = "login.html";

        return;
    }


    // --------------------------------------------------
    // GET ELEMENTS
    // --------------------------------------------------

    const welcomeName =
        document.getElementById("welcomeName");

    const topName =
        document.getElementById("topName");

    const topDepartment =
        document.getElementById("topDepartment");

    const topAvatar =
        document.getElementById("topAvatar");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileName =
        document.getElementById("profileName");

    const profileDepartment =
        document.getElementById("profileDepartment");

    const profileStaffId =
        document.getElementById("profileStaffId");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileDepartment2 =
        document.getElementById("profileDepartment2");


    // --------------------------------------------------
    // DISPLAY USER
    // --------------------------------------------------

    welcomeName.textContent =
        currentStaff.name;

    topName.textContent =
        currentStaff.name;

    topDepartment.textContent =
        currentStaff.department;

    profileName.textContent =
        currentStaff.name;

    profileDepartment.textContent =
        currentStaff.department;

    profileStaffId.textContent =
        currentStaff.staffId;

    profileEmail.textContent =
        currentStaff.email;

    profileDepartment2.textContent =
        currentStaff.department;


    // Get first letter
    const firstLetter =
        currentStaff.name.charAt(0).toUpperCase();

    topAvatar.textContent =
        firstLetter;

    profileAvatar.textContent =
        firstLetter;


    // --------------------------------------------------
    // STAFF STATISTICS
    // --------------------------------------------------

    const users =
        JSON.parse(localStorage.getItem("staffUsers")) || [];


    document.getElementById("totalStaff")
        .textContent = users.length;


    // Get unique departments
    const departments =
        [...new Set(
            users.map(user => user.department)
        )];


    document.getElementById("totalDepartments")
        .textContent = departments.length;


    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------

    document
        .getElementById("logoutBtn")
        .addEventListener("click", function () {

            const confirmLogout =
                confirm("Are you sure you want to logout?");


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem("currentStaff");

            window.location.href =
                "login.html";

        });


    // --------------------------------------------------
    // MOBILE MENU
    // --------------------------------------------------

    const menuBtn =
        document.getElementById("menuBtn");

    const sidebar =
        document.querySelector(".sidebar");


    menuBtn.addEventListener("click", function () {

        sidebar.classList.toggle("show");

    });


    // --------------------------------------------------
    // ADD NOTICE
    // --------------------------------------------------

    document
        .getElementById("addNoticeBtn")
        .addEventListener("click", function () {

            const title =
                prompt("Enter notice title:");

            if (!title) {
                return;
            }


            const description =
                prompt("Enter notice description:");

            if (!description) {
                return;
            }


            const noticeList =
                document.getElementById("noticeList");


            const notice =
                document.createElement("div");

            notice.className = "notice";


            notice.innerHTML = `

                <div class="notice-icon">
                    📢
                </div>

                <div>
                    <strong>
                        ${escapeHTML(title)}
                    </strong>

                    <p>
                        ${escapeHTML(description)}
                    </p>
                </div>

                <time>
                    Just now
                </time>

            `;


            noticeList.prepend(notice);

        });


    // --------------------------------------------------
    // ESCAPE HTML
    // --------------------------------------------------

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});