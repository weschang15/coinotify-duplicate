const router = require("express").Router();
const accountRoutes = require("./misc/accounts");
const { marketRoutes, botRoutes, userRoutes } = require("./resources");

router.use("/accounts", accountRoutes);
router.use("/markets", marketRoutes);
router.use("/bots", botRoutes);
router.use("/users", userRoutes);

module.exports = router;
