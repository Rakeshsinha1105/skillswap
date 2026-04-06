const express = require('express');
const router = express.Router();
const { sendRequest, respondToRequest, getMyRequests } = require('../controllers/swapsController');
const auth = require('../middleware/auth');

router.get('/', auth, getMyRequests);
router.post('/', auth, sendRequest);
router.put('/:id', auth, respondToRequest);

module.exports = router;
