const catchAsync = require("./catchAsync");
const executeQuery = require("./connection");

module.exports = storage = async (CNIC, PID, QUANTITY) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query1 = `SELECT PURCHASEDQUANTITY FROM STORAGE WHERE CNIC='${CNIC}' AND PRODUCTID='${PID}'`;
      const already = await executeQuery(query1);

      if (already.length > 0) {
        const query2 = `UPDATE STORAGE SET PURCHASEDQUANTITY=PURCHASEDQUANTITY + ${QUANTITY}`;
        const res = await executeQuery(query2);
        resolve();
      } else {
        const query3 = `INSERT INTO STORAGE(CNIC,PRODUCTID,PURCHASEDQUANTITY)
            VALUES('${CNIC}','${PID}',${QUANTITY})`;
        await executeQuery(query3);
        resolve();
      }
    } catch (error) {
      console.error("Error in storage:", error);
      reject(error);
    }
  });
};
