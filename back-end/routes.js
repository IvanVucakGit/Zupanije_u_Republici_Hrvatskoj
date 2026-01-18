const express = require("express");
const c = require("./controllers");

const router = express.Router();

const notImplemented = (req, res) => {
   res.status(501).json({
      status: "Not Implemented",
      message: "Method not implemented for requested resource",
      response: null
   });
};

const requireLoginApi = (req, res, next) => {
   if (req.oidc.isAuthenticated()) {
      return next();
   }

   res.status(401).json({
      status: "Unauthorized",
      message: "Niste prijavljeni",
      response: null
   });
}

router.get("/login", (req, res) => {
  res.oidc.login();
});

router.get("/logout", (req, res) => {
  res.oidc.logout({ returnTo: "/" });
});

router.get("/profile", requireLoginApi, (req, res) => {
   res.json({
      status: "OK",
      message: "Korisnički profil",
      response: req.oidc.user
   });
});

router.all("/profile", notImplemented);

router.get("/user", (req, res) => {
   res.json({
      isAuthenticated: req.oidc.isAuthenticated(),
      user: req.oidc.user || null
   });
});

router.route("/zupanije").get(c.getZupanije).all(notImplemented);

router.route("/zupanije/datoteke").put(requireLoginApi, c.updateDatoteke).all(notImplemented);

router.route("/gradovi").get(c.getGradovi).post(c.createGrad).all(notImplemented);

router.route("/gradovi/filter").get(c.getFiltrirano).all(notImplemented);

router.route("/gradovi/export/json").get(c.getJson).all(notImplemented);

router.route("/gradovi/export/csv").get(c.getCsv).all(notImplemented);

router.route("/gradovi/:ime").get(c.getByIme).put(c.updateGrad).delete(c.deleteGrad).all(notImplemented);

router.use((req, res) => {
   res.status(404).json({
      status: "Not Found",
      message: "Ruta ne postoji",
      response: null
   });
});

module.exports = router;
