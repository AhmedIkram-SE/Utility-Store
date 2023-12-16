module.exports = security = (req, res, next) => {
  if (req.cookies.employeeId) {
    next();
  } else {
    res.send("Unauthorized");
  }
};
