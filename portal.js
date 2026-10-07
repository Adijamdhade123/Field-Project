/* =========================================
   EDUSTAFF PORTAL
   SUPABASE + LOCAL STORAGE SYNC
========================================= */

let supabaseStatus = {
    connected: false,
    tablesReady: false,
    missingTables: []
};

/* =========================================
   INITIALIZE DATABASE & SYNC
========================================= */

function initializeDatabase() {
    let users = JSON.parse(localStorage.getItem("staffUsers")) || [];

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
            createdAt: new Date().toISOString()
        };

        users.push(admin);
        localStorage.setItem("staffUsers", JSON.stringify(users));
    }

    if (!localStorage.getItem("staffData")) {
        localStorage.setItem("staffData", JSON.stringify(users));
    }

    if (!localStorage.getItem("attendanceRecords")) {
        localStorage.setItem("attendanceRecords", JSON.stringify({}));
    }

    if (!localStorage.getItem("collegeNotices")) {
        const defaultNotices = [
            {
                id: 1,
                title: "Welcome to EduStaff Portal",
                date: getToday(),
                description: "The college staff management portal is now ready to use with Supabase sync.",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem("collegeNotices", JSON.stringify(defaultNotices));
    }

    // Initiate remote sync with Supabase backend
    checkSupabaseAndSync();
}

/* =========================================
   SUPABASE BACKEND SYNC
========================================= */

async function checkSupabaseAndSync() {
    try {
        const res = await fetch("/api/status");
        if (!res.ok) return;
        const data = await res.json();
        supabaseStatus = data;

        renderSupabaseBadge(data);

        if (data.connected && data.tablesReady) {
            await syncAllFromSupabase();
        }
    } catch (err) {
        console.warn("Could not reach Supabase API endpoint:", err);
    }
}

async function syncAllFromSupabase() {
    try {
        // Fetch staff
        const staffRes = await fetch("/api/staff");
        if (staffRes.ok) {
            const { staff } = await staffRes.json();
            if (Array.isArray(staff) && staff.length > 0) {
                localStorage.setItem("staffData", JSON.stringify(staff));
                localStorage.setItem("staffUsers", JSON.stringify(staff));
                if (typeof renderStaff === "function") renderStaff();
                if (typeof loadDashboard === "function") loadDashboard();
            }
        }

        // Fetch attendance
        const attRes = await fetch("/api/attendance");
        if (attRes.ok) {
            const { attendance } = await attRes.json();
            if (attendance && Object.keys(attendance).length > 0) {
                localStorage.setItem("attendanceRecords", JSON.stringify(attendance));
                if (typeof renderAttendance === "function") renderAttendance();
                if (typeof loadDashboard === "function") loadDashboard();
            }
        }

        // Fetch notices
        const notRes = await fetch("/api/notices");
        if (notRes.ok) {
            const { notices } = await notRes.json();
            if (Array.isArray(notices) && notices.length > 0) {
                localStorage.setItem("collegeNotices", JSON.stringify(notices));
                if (typeof renderNotices === "function") renderNotices();
                if (typeof loadRecentNotices === "function") loadRecentNotices();
            }
        }
    } catch (err) {
        console.warn("Supabase data sync error:", err);
    }
}

/* =========================================
   SUPABASE STATUS UI & SETUP HELPER
========================================= */

function renderSupabaseBadge(status) {
    if (document.getElementById("supabase-status-badge")) return;

    const badge = document.createElement("div");
    badge.id = "supabase-status-badge";
    badge.style.cssText = "position:fixed;bottom:16px;left:16px;z-index:9999;font-family:system-ui,-apple-system,sans-serif;font-size:12px;background:#0f172a;color:#f8fafc;padding:6px 12px;border-radius:20px;border:1px solid #334155;display:flex;align-items:center;gap:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);cursor:pointer;";

    if (status.connected && status.tablesReady) {
        badge.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;"></span> <span>Supabase: Active</span>`;
        badge.title = "Connected to Supabase project pjecoywhpmbuuyrhpdwa (Tables synchronized)";
    } else if (status.connected) {
        badge.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;"></span> <span>Supabase: Setup SQL Needed</span>`;
        badge.title = "Connected to Supabase! Click to view SQL schema for table setup.";
        badge.onclick = showSqlSetupModal;
    } else {
        badge.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#64748b;display:inline-block;"></span> <span>Local Storage Active</span>`;
    }

    document.body.appendChild(badge);
}

function showSqlSetupModal() {
    let modal = document.getElementById("supabase-sql-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "supabase-sql-modal";
        modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;";

        const sql = `-- EduStaff Supabase Schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/pjecoywhpmbuuyrhpdwa/sql

CREATE TABLE IF NOT EXISTS public.staff_members (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    staff_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    designation TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    qualification TEXT DEFAULT '',
    joining_date TEXT DEFAULT '',
    address TEXT DEFAULT '',
    password TEXT NOT NULL DEFAULT 'Admin@123',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    staff_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, date)
);

CREATE TABLE IF NOT EXISTS public.notices (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read staff" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert staff" ON public.staff_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update staff" ON public.staff_members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete staff" ON public.staff_members FOR DELETE USING (true);

CREATE POLICY "Allow public read attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update attendance" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete attendance" ON public.attendance_records FOR DELETE USING (true);

CREATE POLICY "Allow public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert notices" ON public.notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update notices" ON public.notices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete notices" ON public.notices FOR DELETE USING (true);

INSERT INTO public.staff_members (staff_id, name, email, department, designation, password)
VALUES ('STAFF001', 'College Administrator', 'admin@college.edu', 'Administration', 'Administrator', 'Admin@123')
ON CONFLICT (staff_id) DO NOTHING;`;

        modal.innerHTML = `
            <div style="background:#fff;max-width:680px;width:100%;max-height:85vh;border-radius:12px;padding:24px;display:flex;flex-direction:column;box-shadow:0 20px 40px rgba(0,0,0,0.3);position:relative;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="margin:0;font-size:18px;color:#0f172a;">⚡ Connect Supabase Database</h3>
                    <button id="close-sql-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;">✕</button>
                </div>
                <p style="font-size:13px;color:#475569;margin-top:0;margin-bottom:12px;">
                    Your Supabase credentials (Project: <strong>pjecoywhpmbuuyrhpdwa</strong>) are connected. To finish database setup, run this SQL script in your Supabase SQL Editor:
                </p>
                <textarea id="sql-content-box" readonly style="flex:1;min-height:220px;font-family:monospace;font-size:11px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;white-space:pre;overflow:auto;resize:none;">${sql}</textarea>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
                    <a href="https://supabase.com/dashboard/project/pjecoywhpmbuuyrhpdwa/sql" target="_blank" rel="noopener noreferrer" style="font-size:13px;color:#2563eb;text-decoration:none;">Open Supabase SQL Editor →</a>
                    <button id="copy-sql-btn" style="background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:13px;cursor:pointer;font-weight:500;">📋 Copy SQL Script</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("close-sql-modal").onclick = () => modal.remove();
        document.getElementById("copy-sql-btn").onclick = () => {
            navigator.clipboard.writeText(sql).then(() => {
                showToast("SQL copied to clipboard!", "success");
            });
        };
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

/* =========================================
   STAFF FUNCTIONS
========================================= */

function getStaff() {
    return JSON.parse(localStorage.getItem("staffData")) || [];
}

function saveStaff(staff) {
    localStorage.setItem("staffData", JSON.stringify(staff));

    let users = JSON.parse(localStorage.getItem("staffUsers")) || [];
    staff.forEach(member => {
        const userIndex = users.findIndex(user => user.staffId === member.staffId);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name: member.name,
                email: member.email,
                department: member.department,
                designation: member.designation,
                phone: member.phone
            };
        } else {
            users.push(member);
        }
    });
    localStorage.setItem("staffUsers", JSON.stringify(users));

    // Asynchronously push each staff to Supabase backend
    staff.forEach(member => {
        fetch("/api/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member)
        }).catch(err => console.warn("Supabase staff sync warning:", err));
    });
}

function deleteStaffRemote(staffId) {
    fetch(`/api/staff/${encodeURIComponent(staffId)}`, {
        method: "DELETE"
    }).catch(err => console.warn("Supabase staff delete warning:", err));
}

/* =========================================
   ATTENDANCE FUNCTIONS
========================================= */

function getAttendance() {
    return JSON.parse(localStorage.getItem("attendanceRecords")) || {};
}

function saveAttendance(attendance) {
    localStorage.setItem("attendanceRecords", JSON.stringify(attendance));
}

function markAttendanceRemote(staffId, date, status) {
    fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, date, status })
    }).catch(err => console.warn("Supabase attendance sync warning:", err));
}

/* =========================================
   NOTICE FUNCTIONS
========================================= */

function getNotices() {
    return JSON.parse(localStorage.getItem("collegeNotices")) || [];
}

function saveNotices(notices) {
    localStorage.setItem("collegeNotices", JSON.stringify(notices));
}

function saveNoticeRemote(notice) {
    fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notice)
    }).catch(err => console.warn("Supabase notice sync warning:", err));
}

function deleteNoticeRemote(id) {
    if (!id) return;
    fetch(`/api/notices/${encodeURIComponent(id)}`, {
        method: "DELETE"
    }).catch(err => console.warn("Supabase notice delete warning:", err));
}

/* =========================================
   CURRENT USER & SESSIONS
========================================= */

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentStaff"));
}

function protectPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("currentStaff");
    window.location.href = "login.html";
}

function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}

function escapeHTML(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================
   TOAST NOTIFICATION (IFRAME SAFE)
========================================= */

function showToast(message, type = "info") {
    let container = document.getElementById("edustaff-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "edustaff-toast-container";
        container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = "pointer-events:auto;min-width:240px;max-width:380px;background:#1e293b;color:#f8fafc;padding:12px 18px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.25);font-size:14px;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;gap:12px;opacity:0;transform:translateY(10px);transition:all 0.25s ease;border-left:4px solid #4f46e5;";

    if (type === "error") toast.style.borderLeftColor = "#ef4444";
    if (type === "success") toast.style.borderLeftColor = "#10b981";

    const icon = type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️";
    toast.innerHTML = `<span style="font-size:18px;">${icon}</span><span style="flex:1;">${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 260);
    }, 3500);
}

window.alert = function (msg) {
    showToast(msg, "info");
};

/* =========================================
   START DATABASE
========================================= */

initializeDatabase();
