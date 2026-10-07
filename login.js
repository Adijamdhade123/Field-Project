document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const message = document.getElementById("loginMessage");
    const forgotPassword = document.getElementById("forgotPassword");


    // --------------------------------------------------
    // CREATE DEFAULT ADMIN ACCOUNT
    // --------------------------------------------------

    let users = JSON.parse(localStorage.getItem("staffUsers")) || [];

    if (users.length === 0) {

        const defaultUser = {
            staffId: "STAFF001",
            name: "College Administrator",
            email: "admin@college.edu",
            department: "Administration",
            password: "Admin@123",
            createdAt: new Date().toISOString()
        };

        users.push(defaultUser);

        localStorage.setItem(
            "staffUsers",
            JSON.stringify(users)
        );
    }


    // --------------------------------------------------
    // SHOW / HIDE PASSWORD
    // --------------------------------------------------

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "👁";

        }

    });


    // --------------------------------------------------
    // LOGIN
    // --------------------------------------------------

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const staffId = document
            .getElementById("staffId")
            .value
            .trim()
            .toUpperCase();

        const password = passwordInput.value;

        message.className = "message";
        message.textContent = "";


        if (!staffId || !password) {

            showMessage(
                "Please enter Staff ID and password.",
                "error"
            );

            return;
        }


        // Get latest users
        users = JSON.parse(
            localStorage.getItem("staffUsers")
        ) || [];


        const user = users.find(function (account) {

            return (
                account.staffId.toUpperCase() === staffId &&
                account.password === password
            );

        });


        if (!user) {

            showMessage(
                "Invalid Staff ID or password.",
                "error"
            );

            return;
        }


        // --------------------------------------------------
        // SAVE LOGIN SESSION
        // --------------------------------------------------

        const session = {
            staffId: user.staffId,
            name: user.name,
            email: user.email,
            department: user.department,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(
            "currentStaff",
            JSON.stringify(session)
        );


        // Save last login
        localStorage.setItem(
            "lastLogin",
            new Date().toISOString()
        );


        // Remember me
        const rememberMe =
            document.getElementById("rememberMe").checked;

        localStorage.setItem(
            "rememberMe",
            rememberMe ? "true" : "false"
        );


        showMessage(
            "Login successful! Redirecting...",
            "success"
        );


        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 700);

    });


    // --------------------------------------------------
    // FORGOT PASSWORD
    // --------------------------------------------------

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        alert(
            "For this localStorage project, password reset is handled by creating a new account. A real production website would use a secure email/password-reset system."
        );

    });


    // --------------------------------------------------
    // MESSAGE FUNCTION
    // --------------------------------------------------

    function showMessage(text, type) {

        message.textContent = text;

        message.className =
            "message " + type;

    }

});