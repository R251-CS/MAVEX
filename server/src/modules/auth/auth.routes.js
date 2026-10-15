const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');

/**
 * GET /api/v1/auth/me
 * Returns authenticated user info along with profile, role, and departmentId
 */
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
