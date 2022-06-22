import express from 'express';
import config from '../../config';
import User from '../../models/users/User';
import crypto from 'crypto';
import { getToken } from '../../controller/utils';

const route = () => {
  const router = new express.Router();

  router.route('/login').post((req, res) => {
    
    const { username, password, email } = req.body;

    if ((username || email) && password) {
      User.findOne({
        $or: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      })
        .then((user) => {
          if (
            user.password ===
            crypto
              .Hmac('sha256', config.APIPASSKEY)
              .update(password)
              .digest('hex')
          ) {
            const accessToken = getToken(user, '1d');

            User.updateOne(
              { $or: [{ username: username }, { email: email }] },
              {
                $set: { last_login: Date.now(), accessToken: accessToken },
              }
            ).then(() => {});

            res.send({
              status: true,
              accessToken: accessToken,
            });
          }
        })
        .catch((error) => {
          res.send({
            status: false,
            message: error.message,
          });
        });
      return false;
    }

    res.send({
      status: false,
      message: 'Kullanıcı adı ya da parola girin.',
    });

  });

  router.route('/create').post((req, res) => {
    const { username, password, email, name } = req.body;

    User.findOne({ username: username }).then((user) => {
      if (!user) {
        const newUser = new User({
          username: username,
          email: email,
          name: name,
          password: crypto
            .Hmac('sha256', config.APIPASSKEY)
            .update(password)
            .digest('hex'),
          created_date: Date.now(),
        });

        const accessToken = getToken(newUser, '1d');
        newUser.accessToken = accessToken;

        newUser
          .save()
          .then((data) => {
            res.send({
              status: true,
              data: {
                username: data.username,
                email: data.email,
              },
              accessToken: accessToken,
            });
          })
          .catch((error) => {
            res.send({
              status: false,
              message: error.message,
            });
          });

        return false;
      }
      res.send({
        status: false,
        message: 'Kullanıcı mevcut :(',
      });
    });
  });

  return router;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  route,
  routePrefix: `/${config.version}/auth`,
};
