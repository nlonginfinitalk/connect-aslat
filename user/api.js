const express = require('express');
const UserService = require('./services');

const router = express.Router();

module.exports = (params) => {
  router.get('/', async (req, res, next) => {
    try {
      const users = await UserService.findAll();
      return res.status(200).json({
        users: {
          metadata: {
            total: users.length,
          },
          data: users,
        },
      })
    } catch (e) {
      // This is unexpected error, so pass it on
      return next(e);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const existUser = await UserService.find({
        email: req.body.email,
      });

      if (existUser) {
        res.status(400).json({
          message: 'The email had exist',
        });
      }
      const user = await UserService.create(req.body.name, req.body.email);
      return res.status(200).json({
        user,
      })
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).json({
          error: {
            message: e.message,
          },
        })
      }

      // This is unexpected error, so pass it on
      return next(e);
    }
  });

  router.delete('/', async (req, res, next) => {
    try {
      await UserService.empty();
      res.status(200).json({
        message: 'User collection is empty',
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
