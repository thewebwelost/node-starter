const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, email, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: 'Name or password missing' });

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    // encrypting password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // create and store new user
    const newUser = await User.create({
      username: user,
      email,
      pwd: hashedPwd,
    });

    res.status(201).json({ success: `User ${newUser.username} added` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
};
