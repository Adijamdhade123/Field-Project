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


        // Try Supabase auth first
        fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ staffId, password })
        })
        .then(res => res.json())
        .then(result => {
            if (result.success && result.user) {
                localStorage.setItem("currentStaff", JSON.stringify(result.user));
                localStorage.setItem("lastLogin", new Date().toISOString());
                const rememberMe = document.getElementById("rememberMe").checked;
                localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
                showMessage("Login successful! Redirecting...", "success");
                setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
            } else {
                fallbackLocalLogin();
            }
        })
        .catch(() => {
            fallbackLocalLogin();
        });

        function fallbackLocalLogin() {
            users = JSON.parse(localStorage.getItem("staffUsers")) || [];
            const user = users.find(account =>
                account.staffId.toUpperCase() === staffId &&
                account.password === password
            );

            if (!user) {
                showMessage("Invalid Staff ID or password.", "error");
                return;
            }

            const session = {
                staffId: user.staffId,
                name: user.name,
                email: user.email,
                department: user.department,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem("currentStaff", JSON.stringify(session));
            localStorage.setItem("lastLogin", new Date().toISOString());
            const rememberMe = document.getElementById("rememberMe").checked;
            localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

            showMessage("Login successful! Redirecting...", "success");
            setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
        }
        return;

    });


    // --------------------------------------------------
    // FORGOT PASSWORD
    // --------------------------------------------------

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        showMessage(
            "Password reset: You can register a new staff account or use default admin (STAFF001 / Admin@123).",
            "error"
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