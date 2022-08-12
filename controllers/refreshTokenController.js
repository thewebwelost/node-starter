const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });

  const foundUser = await User.findOne({ refreshToken }).exec();
  // reuse refresh token scenario
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const user = await User.findOne({ email: decoded.email }).exec();
        user.refreshToken = [];
        await user.save();
      }
    );
    return res.sendStatus(403);
  }

  const newRefreshTokenArr = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArr];
        await foundUser.save();
      }

      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          userInfo: {
            email: decoded.email,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
      );

      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      foundUser.refreshToken = [...newRefreshTokenArr, newRefreshToken];
      foundUser.save();

      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ roles, accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
