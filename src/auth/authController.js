const User = require('../../models/User');
const Role = require('../../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { validationResult } = require('express-validator');
const { secret } = require('./config');

const generateAccessToken = (id, username, roles) => {
  const payload = {
    id,
    username,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Ошибка при регистрации', errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      let hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });
      await user.save();
      return res.json({ message: 'Пользователь успешно зарегестрирован' });
    } catch (e) {
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `Пользователь с username ${username} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Введен неверный пароль` });
      }
      const token = generateAccessToken(user._id, user.username, user.roles);
      res.set(
        'Set-Cookie',
        cookie.serialize('Token', token, {
          httpOnly: true,
        }),
      );
      res.send({ token });
    } catch (e) {
      res.status(400).json({ message: 'Login error ' + e });
    }
  }

  async deleteUser(req, res) {
    try {
      const { username } = req.body;
      await User.deleteOne({ username: username });
      res.status(200).json({ message: 'Пользователь удален' });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find({ roles: 'USER' });
      res.json(users);
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }

  async getRole(req, res) {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });
      res.json(user.roles);
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }

  async getTodo(req, res) {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });
      res.json(user.todo);
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }

  async setTodo(req, res) {
    try {
      const { username, deadline, title, description } = req.body;
      const user = await User.findOne({ username });
      user.todo.push([deadline, title, description]);
      await user.save();
      res.json('Todo add');
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }

  async deleteAllTodo(req, res) {
    try {
      const { username } = req.body;
      await User.updateOne({ username: username }, { $unset: { todo: 1 } });
      res.json('Todo deleted');
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
}

module.exports = new authController();
