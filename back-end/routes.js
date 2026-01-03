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

router.route("/zupanije").get(c.getZupanije).all(notImplemented);

router.route("/gradovi").get(c.getGradovi).post(c.createGrad).all(notImplemented);

router.route("/gradovi/filter").get(c.getFiltrirano).all(notImplemented);

router.route("/gradovi/export/json").get(c.getJson).all(notImplemented);

router.route("/gradovi/export/csv").get(c.getCsv).all(notImplemented);

router.route("/gradovi/:ime").get(c.getByIme).put(c.updateGrad).delete(c.deleteGrad).all(notImplemented);

module.exports = router;
