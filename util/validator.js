const executeQuery = require("./connection");

module.exports = validator = (CNIC, PID, QUANTITY) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allowedQuantity = 0;
      let storage = 0;
      const query1 = `SELECT LIMITQUANTITY FROM LIMITS WHERE PRODUCTID='${PID}'`;
      const allowed = await executeQuery(query1);
      if (allowed.length > 0) {
        allowedQuantity = allowed[0].LIMITQUANTITY;
        const storageChecking = `SELECT PURCHASEDQUANTITY FROM STORAGE WHERE CNIC='${CNIC}' AND PRODUCTID='${PID}'`;
        storage = await executeQuery(storageChecking);
        console.log(storage);
        if (storage.length > 0) {
          if (QUANTITY + storage[0].PURCHASEDQUANTITY < allowedQuantity) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else if (QUANTITY < allowedQuantity) {
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
