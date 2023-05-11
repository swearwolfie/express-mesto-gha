const router = require('express').Router();
const {
  getUser,
  getUsers,
  changeUser,
  changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', changeUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
