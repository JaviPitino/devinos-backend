const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const winesRoutes = require('./wines.routes')
router.use("/wines", winesRoutes)

const bodegasRoutes = require('./bodegas.routes')
router.use("/bodegas", bodegasRoutes)

const authRoutes = require('./auth.routes')
router.use("/auth", authRoutes)

const profileRoutes = require("./profile.routes")
router.use("/profile", profileRoutes)

const uploaderRoutes = require("./uploader.routes")
router.use("/uploader", uploaderRoutes)

module.exports = router;
