const express = require('express');
const router = express.Router();
const { createSkill, updateSkill, deleteSkill, getUserSkills } = require('../controllers/skillsController');
const auth = require('../middleware/auth');

router.get('/user/:userId', getUserSkills);
router.post('/', auth, createSkill);
router.put('/:id', auth, updateSkill);
router.delete('/:id', auth, deleteSkill);

module.exports = router;
