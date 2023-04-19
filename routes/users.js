const router = require("express").Router();
const {
  createUser,
  getUser,
  getUsers,
  changeUser,
  changeAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.post("/users", createUser);
router.patch("/users/me", changeUser);
router.patch("/users/me/avatar", changeAvatar);

module.exports = router;
