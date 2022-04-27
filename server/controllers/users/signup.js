const { User } = require("../../models");
const bcrypt = require("bcrypt");

// const { hashPassword } = require("../tokenFunctions/security");

module.exports = {
  post: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      // 요청이 잘못된 경우 다음을 리턴
      if (!email || !password || !username) {
        return res.status(400).json({ message: `Bad Request!` });
      }

      const userInfo = await User.findOne({ where: { email } });
      if (userInfo) {
        return res.status(409).json({ message: "user already exists" });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      console.log(newUser);

      return res.send(newUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json();
    }
  },
};