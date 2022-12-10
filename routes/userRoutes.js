const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

// user login work, open to everyone
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// // this for addmin only
// router.use(authController.restrictedTo('admin'));

// router
//   .route('/')
//   .get(userController.getAllUser)
//   .post(userController.createNewUser);

// router
//   .route('/:id')
//   .get(userController.getSpecificUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
