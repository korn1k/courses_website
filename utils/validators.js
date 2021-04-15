const { body } = require('express-validator/check');
const User = require('../models/user');

module.exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Input correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value }); // or req.body.email
        if (user) {
          return Promise.reject('This emails is already in DB');
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body('password', 'Input correct password')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords should be the same');
      }

      return true;
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be minimum 3 symbols')
    .trim(),
];

module.exports.courseValidators = [
  body('title').isLength({ min: 3 }).withMessage('Minimal length is 3').trim(),
  body('price').isNumeric().withMessage('Input correct price'),
  body('img', 'Enter correct img-url').isURL(),
];
