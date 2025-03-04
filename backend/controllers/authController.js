const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('pages/login', {
        title: 'Đăng nhập',
        layout: false
    });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Email hoặc mật khẩu không chính xác');
            return res.redirect('/login');
        }

        // Kiểm tra password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Email hoặc mật khẩu không chính xác');
            return res.redirect('/login');
        }

        // Kiểm tra trạng thái tài khoản
        if (user.status === 'inactive') {
            req.flash('error', 'Tài khoản đã bị khóa');
            return res.redirect('/login');
        }

        // Cập nhật thời gian đăng nhập cuối
        user.lastLogin = new Date();
        await user.save();

        // Lưu thông tin user vào session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success', 'Đăng nhập thành công');
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại');
        res.redirect('/login');
    }
};

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/login');
    });
}; 