import jwt from 'jsonwebtoken';
import config from '../config';

const getToken = (user, expireTime) => {
  return jwt.sign(
    {
      id: user.id,
      roleID: user.roleID,
    },
    config.APIPASSKEY,
    {
      expiresIn: expireTime || 48,
    }
  );
};

export { getToken };
