module.exports = (req, res, next) => {
  const statusTocheck = ["draft", "inbox", "sent", "starred"];
  let flag = false;
  for (let i = 0; i < statusTocheck.length; i++) {
    // Check if the string is equal to the current element
    if (req.params.status === statusTocheck[i]) {
      // If a match is found, return true
      flag = true;
      break;
    }
  }
  // If no match is found, return false
  if (!flag) {
    return res.status(400).json({ message: "invalid status" });
  }
  next();
};
