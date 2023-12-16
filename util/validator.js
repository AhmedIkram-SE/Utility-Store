const executeQuery = require("./connection");

module.exports = validator = (CNIC, PID, QUANTITY) => {
  return new Promise(async (resolve, reject) => {
    try {
      let alreadyPurchased = 0;
      let allowedQuantity = 0;
      const query1 = `SELECT LIMITQUANTITY FROM LIMITS WHERE PRODUCTID='${PID}'`;
      const query2 = `SELECT PURCHASEDQUANTITY FROM STORAGE WHERE CNIC='${CNIC}' AND PRODUCTID='${PID}'`;
      const allowed = await executeQuery(query1);
      const already = await executeQuery(query2);

      if (already.length > 0) {
        alreadyPurchased = already[0].PURCHASEDQUANTITY;
      }

      if (allowed.length > 0) {
        allowedQuantity = allowed[0].LIMITQUANTITY;
        if (alreadyPurchased + QUANTITY <= allowedQuantity) {
          resolve(true);
        } else {
          resolve(false);
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
