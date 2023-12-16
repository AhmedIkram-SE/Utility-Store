const executeQuery = require("../util/connection");
const catchAsync = require("../util/catchAsync");

exports.getProduct = catchAsync(async (req, res) => {
  const query = `SELECT * FROM PRODUCTS WHERE PRODUCTNAME ='${req.params.id}'`;
  let product = await executeQuery(query);
  product[0].QUANTITY = 1;
  product[0].PRODUCTNAME = product[0].PRODUCTNAME.toLowerCase();
  res.json({
    product: product[0],
  });
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
  console.log(data);
  if (data.length === 0) {
    res.json({
      message: "nothing",
    });
  }
  if (req.body.quantity) {
    const query = `UPDATE INVENTORY
    SET PRODUCTQUANTITY = ${req.body.quantity}
    WHERE PRODUCTID = '${req.body.productId}'`;
    await executeQuery(query);
    res.json({
      message: "success",
    });
  } else if (req.body.price) {
    const query = `UPDATE PRODUCTS
    SET UNITPRICE = ${req.body.price}
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
