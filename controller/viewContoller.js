const executeQuery = require("../util/connection");
const catchAsync = require("../util/catchAsync");

//1.LOGIN PAGE
exports.login = (req, res, next) => {
  res.cookie("employeeId", "");
  res.render("login");
};

//2. DASHBOARD
exports.home = catchAsync(async (req, res, next) => {
  const query1 = `SELECT SUM(O.PURCHASEDQUANTITY * P.UNITPRICE) AS SALES
  FROM ORDERS O
  JOIN PRODUCTS P ON O.PRODUCTID = P.PRODUCTID`;
  const query2 = `SELECT COUNT(*) AS PRODUCTS
  FROM PRODUCTS`;
  const query3 = `
  SELECT
    
      SUM(O.PURCHASEDQUANTITY * P.UNITPRICE) AS SALES
  FROM
      SALES S
  JOIN
      ORDERS O ON S.SALEID = O.SALEID
  JOIN
      PRODUCTS P ON O.PRODUCTID = P.PRODUCTID
  WHERE
      CONVERT(DATE, S.SALEDATE) = CONVERT(DATE, GETDATE())
  GROUP BY
      CONVERT(DATE, S.SALEDATE)`;

  const query4 = `SELECT COUNT(*) AS EMPLOYEES
  FROM EMPLOYEES`;
  const query5 = `SELECT COUNT(*) AS CUSTOMERS
  FROM CUSTOMERS`;
  const query6 = `SELECT COUNT(DISTINCT SALEID) AS ORDERS
  FROM ORDERS`;
  const query7 = `SELECT EMPLOYEENAME FROM EMPLOYEES WHERE EMPLOYEEID='${req.cookies.employeeId}'`;
  const SALES = await executeQuery(query1);
  const PRODUCTS = await executeQuery(query2);
  const STOCKS = await executeQuery(query3);
  const EMPLOYEES = await executeQuery(query4);
  const CUSTOMERS = await executeQuery(query5);
  const ORDERS = await executeQuery(query6);
  const USER = await executeQuery(query7);

  const data = {
    SALES: SALES[0].SALES === null || SALES[0].length < 1 ? 0 : SALES[0].SALES,
    TSALES: STOCKS.length < 1 ? 0 : STOCKS[0].SALES,
    CUSTOMERS: CUSTOMERS[0].CUSTOMERS,
    PRODUCTS: PRODUCTS[0].PRODUCTS,
    EMPLOYEES: EMPLOYEES[0].EMPLOYEES,
    ORDERS: ORDERS[0].ORDERS,
    USER: USER[0].EMPLOYEENAME,
  };
  res.render("home", { data });
});

//3. PRODUCT INFORMATION
exports.product = (req, res, next) => {
  res.render("product");
};

//4. CUSTOMER INFORMATION
exports.customer = (req, res, next) => {
  res.render("customer");
};

//5. CHECKING INVENTORY
exports.stock = catchAsync(async (req, res) => {
  const query = `	SELECT
  P.PRODUCTID,
  P.PRODUCTNAME,
  P.UNITPRICE AS PRODUCTPRICE,
  I.PRODUCTQUANTITY AS STOCK
FROM
  PRODUCTS P
JOIN
  INVENTORY I ON P.PRODUCTID = I.PRODUCTID;`;
  const data = await executeQuery(query);

  res.render("stock", { stock: data });
});

//6. CHECKING ORDERS BY EMPLOYEE LIKE SALE ID
exports.sales = catchAsync(async (req, res, next) => {
  const sale = `	DELETE FROM SALES
  WHERE NOT EXISTS (
      SELECT 1
      FROM ORDERS
      WHERE ORDERS.SALEID = SALES.SALEID
  );`;

  await executeQuery(sale);

  const query = `
  SELECT
    S.SALEID,
    C.CUSTOMERNAME,
    C.CNIC,
    E.EMPLOYEENAME,
    SUM(P.UNITPRICE * O.PURCHASEDQUANTITY) AS TOTAL_AMOUNT,
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
GROUP BY
    S.SALEID, C.CUSTOMERNAME, C.CNIC, E.EMPLOYEENAME, S.SALEDATE;`;

  const data = await executeQuery(query);
  conversion(data);
  res.render("sales", { sales: data });
});

//7. CHECKING ORDER DETAILS
exports.order = (req, res, next) => {
  res.render("order");
};

//8. POS PAGE
exports.pos = (req, res, next) => {
  res.render("pos");
};

//CUSTOMER DETAILS
exports.getCustomerDetails = async (req, res, next) => {
  const query = `SELECT * FROM CUSTOMERS`;
  const data = await executeQuery(query);
  res.render("customerdetails", { data });
};

function conversion(data) {
  data.forEach((ele) => {
    var dateObject = new Date(ele.SALEDATE);
    var day = dateObject.getDate().toString().padStart(2, "0");
    var month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    var year = dateObject.getFullYear();
    var formattedDate = day + "-" + month + "-" + year;
    ele.SALEDATE = formattedDate;
  });
}
