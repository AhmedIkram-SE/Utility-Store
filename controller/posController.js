const executeQuery = require("../util/connection");
const catchAsync = require("../util/catchAsync");
const validator = require("../util/validator");
const storage = require("../util/storage");

//LOGIN VALIDATOR
exports.employeeLogin = catchAsync(async (req, res) => {
  let data = {};
  const { employeeId, password } = req.body;
  const query = `SELECT * from EMPLOYEES WHERE EMPLOYEEID = '${req.body.employeeId}'`;
  data = await executeQuery(query);
  if (data && data.length > 0) {
    //CHECK CREDENTIALS
    if (
      employeeId === data[0].EMPLOYEEID &&
      password === data[0].EMPLOYEEPASS
    ) {
      res.cookie("employeeId", employeeId, { httpOnly: true });
      res.redirect("/home");
    } //WRONG CREDENTIALS
    else {
      res.render("login", { errorMessage: "Invalid credentials" });
    } //NO USER FOUND
  } else {
    res.render("login", { errorMessage: "This User Not Exists" });
  }
});

//ADDING CUSTOMER
exports.addCustomer = catchAsync(async (req, res) => {
  const query1 = `SELECT CNIC FROM CUSTOMERS WHERE CNIC= '${req.body.cnic}'`;
  const data = await executeQuery(query1);
  if (data.length > 0) {
    res.render("customer", {
      success: `${req.body.cnic} already exists`,
    });
  } else {
    const query = `INSERT INTO CUSTOMERS(CNIC,CUSTOMERNAME,CustomerAddress,PhoneNumber)
VALUES (?,?,?,?)`;
    const values = [
      req.body.cnic,
      req.body.customername,
      req.body.address,
      req.body.phonenumber,
    ];
    await executeQuery(query, values);
    res.render("customer", { success: "Customer Added" });
  }
});

//ADDING PRODUCT
exports.addProduct = catchAsync(async (req, res) => {
  const query = `SELECT PRODUCTID FROM PRODUCTS WHERE PRODUCTID= '${req.body.productid}'`;
  const data = await executeQuery(query);
  if (data.length > 0) {
    res.render("product", {
      success: `${req.body.productid} is already in use`,
    });
  } else {
    const query1 = `INSERT INTO PRODUCTS (PRODUCTID,PRODUCTNAME,UNITPRICE,SALESTAX)
VALUES (?,?,?,?)`;
    const query2 = `INSERT INTO INVENTORY(PRODUCTID,PRODUCTQUANTITY)
  VALUES(?,?)`;
    const product = [
      req.body.productid,
      req.body.productname,
      parseFloat(req.body.unitprice), // Explicitly convert to float if applicable
      parseFloat(req.body.salestax),
    ];
    const stocks = [req.body.productid, parseInt(req.body.stock)];
    await executeQuery(query1, product);
    await executeQuery(query2, stocks);
    res.render("product", { success: `${req.body.productname} Added` });
  }
});

//CREATE SALE ID
exports.createSaleId = catchAsync(async (req, res) => {
  let dateObject = new Date();
  const values = [
    req.body.cnic,
    req.cookies.employeeId,
    dateObject.toISOString(),
  ];
  const query = `INSERT INTO SALES(CNIC,EMPLOYEEID,SALEDATE)
    VALUES(?,?,?)`;
  await executeQuery(query, values);
  res.json({
    message: "success",
  });
});

////CREATE ORDER
exports.createOrder = catchAsync(async (req, res) => {
  const query = `SELECT MAX(SaleID) AS SALEID FROM Sales`;
  const ID = await executeQuery(query);
  const SALEID = ID[0].SALEID;
  const query2 = `SELECT CNIC FROM SALES WHERE SALEID =${SALEID}`;
  const cnicResult = await executeQuery(query2);
  const CNIC = cnicResult[0].CNIC;
  const products = req.body.products;
  for (const product of products) {
    const { PRODUCTID, PRODUCTNAME, UNITPRICE, SALESTAX, QUANTITY } = product;

    const query = ` INSERT INTO ORDERS (ORDERID,PRODUCTID, SALEID, PURCHASEDQUANTITY)
    VALUES (${SALEID}, '${PRODUCTID}', ${SALEID},${QUANTITY})`;
    const query2 = `UPDATE INVENTORY
    SET PRODUCTQUANTITY = PRODUCTQUANTITY - ${QUANTITY}
    WHERE PRODUCTID = '${PRODUCTID}';`;
    await storage(CNIC, PRODUCTID, QUANTITY);
    const resp = await executeQuery(query);
    const resp2 = await executeQuery(query2);
  }
  res.json({
    message: "success",
  });
});
