-- EduStaff Supabase Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/pjecoywhpmbuuyrhpdwa/sql)

-- 1. Staff Members Table
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

-- 2. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    staff_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, date)
);

-- 3. Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow public access with the anon/publishable key
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon/authenticated roles
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

-- Insert Default Admin if not present
INSERT INTO public.staff_members (staff_id, name, email, department, designation, password)
VALUES ('STAFF001', 'College Administrator', 'admin@college.edu', 'Administration', 'Administrator', 'Admin@123')
ON CONFLICT (staff_id) DO NOTHING;

-- Insert Welcome Notice if empty
INSERT INTO public.notices (title, date, description)
VALUES ('Welcome to EduStaff Portal', CURRENT_DATE::TEXT, 'The college staff management portal is now connected to Supabase and ready to use.')
ON CONFLICT DO NOTHING;
