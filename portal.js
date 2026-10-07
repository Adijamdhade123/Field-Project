/* =========================================
   EDUSTAFF PORTAL
   LOCAL STORAGE DATABASE
========================================= */


/* =========================================
   DEFAULT STAFF
========================================= */

function initializeDatabase() {

    let users =
        JSON.parse(
            localStorage.getItem("staffUsers")
        ) || [];


    if (users.length === 0) {

        const admin = {

            staffId: "STAFF001",

            name: "College Administrator",

            email: "admin@college.edu",

            department: "Administration",

            designation: "Administrator",

            phone: "",

            qualification: "",

            joiningDate: "",

            address: "",

            password: "Admin@123",

            createdAt:
                new Date().toISOString()

        };


        users.push(admin);


        localStorage.setItem(
            "staffUsers",
            JSON.stringify(users)
        );

    }


    /* STAFF DATA */

    if (!localStorage.getItem("staffData")) {

        localStorage.setItem(
            "staffData",
            JSON.stringify(users)
        );

    }


    /* ATTENDANCE */

    if (!localStorage.getItem("attendanceRecords")) {

        localStorage.setItem(
            "attendanceRecords",
            JSON.stringify({})
        );

    }


    /* NOTICES */

    if (!localStorage.getItem("collegeNotices")) {

        const defaultNotices = [

            {

                title: "Welcome to EduStaff Portal",

                date: getToday(),

                description:
                    "The college staff management portal is now ready to use.",

                createdAt:
                    new Date().toISOString()

            }

        ];


        localStorage.setItem(
            "collegeNotices",
            JSON.stringify(defaultNotices)
        );

    }

}


/* =========================================
   STAFF FUNCTIONS
========================================= */

function getStaff() {

    return JSON.parse(
        localStorage.getItem("staffData")
    ) || [];

}


function saveStaff(staff) {

    localStorage.setItem(
        "staffData",
        JSON.stringify(staff)
    );


    /*
       Keep login users synchronized
       with staff information.
    */

    let users =
        JSON.parse(
            localStorage.getItem("staffUsers")
        ) || [];


    staff.forEach(member => {

        const userIndex =
            users.findIndex(
                user => user.staffId === member.staffId
            );


        if (userIndex !== -1) {

            users[userIndex] = {

                ...users[userIndex],

                name: member.name,

                email: member.email,

                department: member.department,

                designation: member.designation,

                phone: member.phone

            };

        }

    });


    localStorage.setItem(
        "staffUsers",
        JSON.stringify(users)
    );

}


/* =========================================
   ATTENDANCE FUNCTIONS
========================================= */

function getAttendance() {

    return JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || {};

}


function saveAttendance(attendance) {

    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(attendance)
    );

}


/* =========================================
   NOTICE FUNCTIONS
========================================= */

function getNotices() {

    return JSON.parse(
        localStorage.getItem("collegeNotices")
    ) || [];

}


function saveNotices(notices) {

    localStorage.setItem(
        "collegeNotices",
        JSON.stringify(notices)
    );

}


/* =========================================
   CURRENT USER
========================================= */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentStaff")
    );

}


function protectPage() {

    const user = getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

    }

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    localStorage.removeItem(
        "currentStaff"
    );


    window.location.href =
        "login.html";

}


/* =========================================
   DATE
========================================= */

function getToday() {

    const now = new Date();


    const year =
        now.getFullYear();


    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");


    const day =
        String(now.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================
   MOBILE SIDEBAR
========================================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");


    if (sidebar) {

        sidebar.classList.toggle("open");

    }

}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   START DATABASE
========================================= */

initializeDatabase();