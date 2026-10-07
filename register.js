document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");
    const message = document.getElementById("registerMessage");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const staffId =
            document.getElementById("staffId").value.trim().toUpperCase();

        const department =
            document.getElementById("department").value;

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Validate password
        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        // Confirm password
        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        // Get existing users
        let users =
            JSON.parse(localStorage.getItem("staffUsers")) || [];


        // Check Staff ID
        const existingStaff = users.find(function (user) {

            return user.staffId.toUpperCase() === staffId;

        });


        if (existingStaff) {

            showMessage(
                "This Staff ID already exists.",
                "error"
            );

            return;
        }


        // Check email
        const existingEmail = users.find(function (user) {

            return user.email.toLowerCase() === email.toLowerCase();

        });


        if (existingEmail) {

            showMessage(
                "This email is already registered.",
                "error"
            );

            return;
        }


        // Create new account
        const newUser = {

            staffId: staffId,

            name: name,

            email: email,

            department: department,

            password: password,

            createdAt: new Date().toISOString()

        };


        users.push(newUser);


        // Save to localStorage
        localStorage.setItem(
            "staffUsers",
            JSON.stringify(users)
        );


        showMessage(
            "Account created successfully! Redirecting to login...",
            "success"
        );


        form.reset();


        setTimeout(function () {

            window.location.href = "login.html";

        }, 1200);

    });


    function showMessage(text, type) {

        message.textContent = text;

        message.className =
            "message " + type;

    }

});