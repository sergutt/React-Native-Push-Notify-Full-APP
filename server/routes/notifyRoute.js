const { testNotify } = require("../controllers/notifyController");

const router = require("express").Router();

router.post("/notification", testNotify);
router.post("/test", (req, res) => {
  res.send("success");
});
module.exports = router;
