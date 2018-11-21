const User = require('./user');

class UserService {
  static create(name, email) {
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;

    // This will return a promise
    return newUser.save();
  }

  static find(user) {
    return User.findOne(user);
  }

  static findAll() {
    return User.find();
  }

  static empty() {
    return User.deleteMany();
  }
}

module.exports = UserService;
