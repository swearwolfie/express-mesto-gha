const router = require("express").Router();
const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");

router.post("/cards", createCard);
router.get("/cards", getCards);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", putLike);
router.delete("/cards/:cardId/likes", deleteLike);

module.exports = router;
