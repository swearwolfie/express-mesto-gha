const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  changeUser,
  changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', changeUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
