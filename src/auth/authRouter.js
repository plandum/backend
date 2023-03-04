const Router = require('express');
const router = new Router();
const controller = require('./authController');
const { check } = require('express-validator');
const roleMiddleware = require('../../middleware/roleMiddleware');

router.post(
  '/registration',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 5 символов').isLength({ min: 5, max: 25 }),
  ],
  controller.registration,
);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);
router.post('/deleteUser', controller.deleteUser);
router.post('/getRoles', controller.getRole);
router.post('/getTodo', controller.getTodo);
router.post('/setTodo', controller.setTodo);
router.post('/deleteTodo', controller.deleteAllTodo);

module.exports = router;
