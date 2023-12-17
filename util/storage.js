const catchAsync = require("./catchAsync");
const executeQuery = require("./connection");

module.exports = storage = (CNIC, PID, QUANTITY) => {
  return new Promise(async (resolve, reject) => {
    try {
      let storage = 0;
      const query1 = `SELECT LIMITQUANTITY FROM LIMITS WHERE PRODUCTID='${PID}'`;
      const allowed = await executeQuery(query1);

      if (allowed.length > 0) {
        const storageChecking = `SELECT PURCHASEDQUANTITY FROM STORAGE WHERE CNIC='${CNIC}' AND PRODUCTID='${PID}'`;
        storage = await executeQuery(storageChecking);
        if (storage.length > 0) {
          const query2 = `UPDATE STORAGE SET PURCHASEDQUANTITY=PURCHASEDQUANTITY + ${QUANTITY}`;
          await executeQuery(query2);
          resolve();
        } else {
          const query3 = `INSERT INTO STORAGE(CNIC,PRODUCTID,PURCHASEDQUANTITY)
          VALUES('${CNIC}','${PID}',${QUANTITY})`;
          await executeQuery(query3);
          resolve();
        }
      } else {
        resolve(true);
      }
    } catch (error) {
      console.error("Error in validator:", error);
      reject(error);
    }
  });
};
