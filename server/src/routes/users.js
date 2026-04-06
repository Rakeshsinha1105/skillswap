const express = require('express');
const router = express.Router();
const { getUser, updateUser, browseUsers } = require('../controllers/usersController');
const auth = require('../middleware/auth');

router.get('/', browseUsers);
router.get('/:id', getUser);
router.put('/:id', auth, updateUser);

module.exports = router;
