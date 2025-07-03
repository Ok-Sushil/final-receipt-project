const User = require('../models/User');

exports.login = async (req, res) => {
    const { username, code } = req.body;

    const user = await User.findOne({ username, code });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ username: user.username, role: user.role });
};