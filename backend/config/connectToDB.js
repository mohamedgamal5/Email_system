const mongoose = require("mongoose");
module.exports = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connect successfully to DB ^_^ ."))
    .catch((error) =>
      console.error("MongoDB connection failed:", error.message)
    );
};
