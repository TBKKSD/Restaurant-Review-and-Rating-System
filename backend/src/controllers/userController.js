const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. สมัครสมาชิก (Register)
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ตรวจสอบว่ามี User นี้หรือยัง
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already in use" });
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกลง MySQL ผ่าน Model
        await User.create(username, hashedPassword);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 2. เข้าสู่ระบบ (Login)
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ค้นหา User จาก Username
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // ตรวจสอบรหัสผ่านว่าตรงกับที่ Hash ไว้ไหม
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // สร้าง JWT Token (เก็บไว้ใช้ยืนยันตัวตนใน Header)
        const token = jwt.sign(
            { userId: user.id, username: user.username }, // ข้อมูลที่ต้องการเก็บใน Token
            process.env.JWT_SECRET || 'your_secret_key', 
            { expiresIn: '1d' }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username}
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 3. ดูข้อมูลตัวเอง (Get Profile)
exports.getProfile = async (req, res) => {
    try {
        // ข้อมูล req.user จะถูกส่งมาจาก Middleware (ถ้าทำเพิ่ม)
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};