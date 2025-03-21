const User = require("../models/userModel");

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }).populate("posts");
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
          }
          return res.json(user);
        
    } catch (ex) {
      next(ex);
    }
};

module.exports = getUser;