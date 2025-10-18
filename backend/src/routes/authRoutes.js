const express = require('express');
const AuthController = require('../controllers/authController');
const AuthDTO = require('../dto/authDTO');
const UserDTO = require('../dto/userDTO');
const { validateBody } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', 
  validateBody(AuthDTO.registerSchema), 
  AuthController.register
);

router.post('/login', 
  validateBody(AuthDTO.loginSchema), 
  AuthController.login
);

router.post('/forgot-password', 
  validateBody(AuthDTO.forgotPasswordSchema), 
  AuthController.forgotPassword
);

router.post('/reset-password', 
  validateBody(AuthDTO.resetPasswordSchema), 
  AuthController.resetPassword
);

// Protected routes
router.use(authMiddleware);

router.post('/logout', AuthController.logout);

router.get('/profile', AuthController.getProfile);

router.put('/profile', 
  validateBody(UserDTO.updateProfileSchema), 
  AuthController.updateProfile
);

router.post('/change-password', 
  validateBody(AuthDTO.changePasswordSchema), 
  AuthController.changePassword
);

router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;