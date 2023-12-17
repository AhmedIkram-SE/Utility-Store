const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewContoller");
const posController = require("../controller/posController");
const queryController = require("../controller/queryController");
const security = require("../util/security");

router.route("/").get(viewController.login).post(posController.employeeLogin);
router.route("/home").get(security, viewController.home);

router
  .route("/customerdetails")
  .get(security, viewController.getCustomerDetails);
router
  .route("/customer")
  .get(security, viewController.customer)
  .post(posController.addCustomer);
router
  .route("/product")
  .get(security, viewController.product)
  .post(posController.addProduct);

router
  .route("/pos")
  .get(security, viewController.pos)
  .post(posController.createSaleId);
router.route("/posdetails").post(posController.createOrder);
router.route("/order").get(security, viewController.order);
router.route("/sales").get(security, viewController.sales);
router
  .route("/stock")
  .get(security, viewController.stock)
  .post(queryController.changeProduct);

router.route("/productvalidation").post(queryController.getProduct);
router.route("/customer/:id").get(queryController.getOrderDetails);
router.route("/customers/:id").get(queryController.getSpecificOrderDetails);

module.exports = router;
