const sql = require("msnodesqlv8");

const connectionString =
  "server=YASEEN;Database=UTILITYSTORE;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

const executeQuery = async (query, values) => {
  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = executeQuery;
