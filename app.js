const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const utilityStoreView = require("./routes/utilityStoreViews");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./util/error");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use(express.static(path.join(__dirname + "/public")));
app.use("/", utilityStoreView);
app.use(errorMiddleware);

app.set("view engine", "ejs");
app.set("views", path.join("./views"));

app.listen(80, () => {
  console.log("Server is running on port 80");
});
