const express = require("express");
require("dotenv").config();
const connectDB = require("./config/connectToDB");
const cors = require("cors");
// const firebaseStorage = require("./config/firebase");
var logger = require("morgan");

const app = express();

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const emailRouter = require("./routers/emailRouter");
const attachmentRouter = require("./routers/attachmentRouter");

app.use(express.json());
app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:3000" }));

//routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/emails", emailRouter);
app.use("/api/attachments", attachmentRouter);

connectDB();
// firebaseStorage;
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("server is running on PORT: ", PORT));
