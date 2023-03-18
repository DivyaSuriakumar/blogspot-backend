const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
// const { createBrowserHistory } = require("@remix-run/router");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));


// ----added by me during hosting
const port = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
// app.use("https://blogspot-api.onrender.com/api/auth", authRoute);
// app.use("https://blogspot-api.onrender.com/api/users", userRoute);
app.use("https://blogspot-api.onrender.com/api/posts", postRoute);
// app.use("https://blogspot-api.onrender.com/api/categories", categoryRoute);

// app.listen("5000", () => {
//   console.log("Backend is running.");
// });
app.listen(port, () => {
  console.log("Backend is running.");
});



