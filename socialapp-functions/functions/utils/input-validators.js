const { check, body } = require('express-validator');

// signup validation
exports.signupValidator = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ min: 1 })
    .withMessage('Please enter your email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters')
    .isLength({ min: 1 })
    .withMessage('Please enter your password'),
  check('confirmPassword')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  check('confirmPassword')
    .isLength({ min: 1 })
    .withMessage('Please confirm your password'),
  check('handle')
    .isLength({ min: 1 })
    .withMessage('Please enter a username')
];

// login validation
exports.loginValidator = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ min: 1 })
    .withMessage('Please enter your email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters')
    .isLength({ min: 1 })
    .withMessage('Please enter your password')
];

const isEmpty = string => {
  if (string.trim() === '') return true;
  else return false;
};

// user details validation
exports.reduceUserDetails = details => {
  let userDetails = {};

  let { bio, website, location } = details;
  bio.trim();
  website.trim();
  location.trim();
  if (!isEmpty(bio)) userDetails.bio = bio;
  if (!isEmpty(website)) {
    // check for http://
    if (website.substring(0, 4) !== 'http') {
      website = `http://${website}`;
    }
    userDetails.website = website;
  }
  if (!isEmpty(location)) userDetails.location = location;

  return userDetails;
};
