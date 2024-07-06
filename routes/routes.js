const controller = require('../controllers/controllerAuth');

let getDemo = controller.getDemo;
let getDemo1 = controller.getDemo1;
let loginData = controller.loginData;
let getEmail = controller.getEmail;
let sendOtp = controller.sendOtp;
let checkOTP = controller.checkOTP;
let uploadImage = controller.uploadImage;
let uploadd = controller.uploadd;
let getViewPage = controller.getViewPage;
let getPageNotFound = controller.getPageNotFound;
let getHomepage = controller.getHomepage;

const express = require("express");
let router = express.Router();

router
  .route("/homepage")
  .get(getHomepage)
//   .post(postSignup);

//http://localhost:3000/viewpage?id=id-1657005431000-123456
router
  .route("/viewpage")
  .get(getViewPage)
//   .post(postSignup);

router
  .route("/pagenotfound")
  .get(getPageNotFound)
//   .post(postSignup);

router
  .route("/demo")
  .get(getDemo)
//   .post(postSignup);

router
  .route("/demo1")
  .get(getDemo1)

router
  .route("/action")
  .get(getDemo1)

router
  .route("/login")
  .get(loginData)

router
  .route("/getemail")
  .get(getEmail)

router
  .route("/sendotp")
  .get(sendOtp)

router
  .route("/otplogin")
  .get(checkOTP)

router
  .route("/uploadimage")
  .post(uploadImage)

router
  .route("/upload")
  .post(uploadd)

module.exports = router;