const executeQuery = require("../util/connection");
const catchAsync = require("../util/catchAsync");
const validator = require("../util/validator");

exports.getProduct = catchAsync(async (req, res) => {
  const query = `SELECT * FROM PRODUCTS WHERE PRODUCTID='${req.body.product}' `;
  const CNIC = req.body.cnic;
  let product = await executeQuery(query);
  /////STOCK CHECKING
  const stock = `SELECT PRODUCTQUANTITY FROM INVENTORY WHERE PRODUCTID = '${product[0].PRODUCTID}' `;
  const available = await executeQuery(stock);
  console.log(req.body);
  if (available[0].PRODUCTQUANTITY >= req.body.quantity + 1) {
    //////
    if (await validator(CNIC, product[0].PRODUCTID, req.body.quantity)) {
      product[0].QUANTITY = 1;
      // product[0].QUANTITY = req.body.quantity + 1;
      product[0].PRODUCTNAME = product[0].PRODUCTNAME;
      product[0].PRODUCTID = product[0].PRODUCTID.toUpperCase();
      res.json({
        product: product[0],
      });
    } else {
      res.json({
        message: `${product[0].PRODUCTNAME} Limit Reached`,
      });
    }
  } else {
    res.json({
      message: `${req.body.product} is out of stock`,
    });
  }
});

exports.getOrderDetails = catchAsync(async (req, res) => {
  const query = `	SELECT
	C.CNIC,
    C.CUSTOMERNAME,
    S.SALEID,
    P.PRODUCTNAME,
    O.PURCHASEDQUANTITY,
    S.SALEDATE
FROM
    CUSTOMERS C
JOIN
    SALES S ON C.CNIC = S.CNIC
JOIN
    ORDERS O ON S.SALEID = O.SALEID
JOIN
    PRODUCTS P ON O.PRODUCTID = P.PRODUCTID
WHERE
    C.CNIC = '${req.params.id}';`;

  const data = await executeQuery(query);
  res.status(200).json({
    data,
  });
});

exports.getSpecificOrderDetails = catchAsync(async (req, res) => {
  const query = `	SELECT
  S.SALEID,
  C.CUSTOMERNAME,
  C.CNIC,
  O.PURCHASEDQUANTITY,
  E.EMPLOYEENAME,
  P.PRODUCTNAME,
  S.SALEDATE
FROM
  SALES S
JOIN
  CUSTOMERS C ON S.CNIC = C.CNIC
JOIN
  EMPLOYEES E ON S.EMPLOYEEID = E.EMPLOYEEID
JOIN
  ORDERS O ON S.SALEID = O.SALEID
JOIN
  PRODUCTS P ON O.PRODUCTID = P.PRODUCTID
WHERE
  S.SALEID = ${req.params.id};`;

  const data = await executeQuery(query);
  res.status(200).json({
    data,
  });
});

exports.changeProduct = catchAsync(async (req, res) => {
  const query = `SELECT * FROM PRODUCTS WHERE PRODUCTID='${req.body.productId}'`;
  const data = await executeQuery(query);
  if (data.length === 0) {
    res.json({
      message: "nothing",
    });
  } else if (req.body.quantity) {
    const query = `UPDATE INVENTORY
    SET PRODUCTQUANTITY = ${req.body.quantity}
    WHERE PRODUCTID = '${req.body.productId}'`;
    await executeQuery(query);
    res.json({
      message: "success",
    });
  } else if (req.body.price) {
    const salestax = req.body.price * 0.18;
    const query = `UPDATE PRODUCTS
    SET UNITPRICE = ${req.body.price}, SALESTAX =${salestax}
    WHERE PRODUCTID = '${req.body.productId}'`;
    await executeQuery(query);
    res.json({
      message: "success",
    });
  } else {
    res.json({
      success: "failed",
    });
  }
});
