module.exports = {
  loginHandler: (db, req, res) => {
    const { email, password: pwd } = req.body;

    const user = db
      .get("users")
      .find((u) => u.email === email && u.password === pwd)
      .value();

    if (user && user.password === pwd) {
      const { password, ...userWithoutPassword } = user;

      res.jsonp({
        ...userWithoutPassword
      });
    } else {
      res.status(400).jsonp({ message: "Email or password is incorrect!" });
    }
  },

  registerHandler: (db, req, res) => {
    const {
      first_name,
      last_name,
      email,
      age,
      avatar,
      phone,
      gender,
      address,
      password,
    } = req.body;

    if (
      !first_name &&
      !last_name &&
      !email &&
      !age &&
      !phone &&
      !gender &&
      !password
    ) {
      res.status(400).jsonp({ message: "Please input all required fields!" });
      return;
    }

    const existEmail = db
      .get("users")
      .find((user) => email && user.email === email)
      .value();

    if (existEmail) {
      res.status(400).jsonp({
        message:
          "The email address is already being used! Please use a different email!",
      });
      return;
    }

    const lastUser = db.get("users").maxBy("id").value();
    const newUserId = parseInt(lastUser.id, 10) + 1;
    const newUser = { id: newUserId, ...req.body };

    db.get("users").push(newUser).write();

    res.jsonp(newUser);
  },
};
