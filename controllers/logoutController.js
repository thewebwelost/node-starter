const User = require('../model/User');

const handleLogout = async (req, res) => {
  // Client should delete the accessToken as well
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
    return res.sendStatus(204);
  }

  // delete the refreshToken from db
  foundUser.refreshToken = '';
  await foundUser.save();

  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
  res.sendStatus(204);
};

module.exports = { handleLogout };
