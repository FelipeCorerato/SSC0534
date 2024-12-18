const bcrypt = require('bcrypt');
const User = require('../models/User');

// Página de Login
exports.getLogin = (req, res) => {
  res.render('login', { error: null }); // Inicialmente sem erro
};

// Página de Registro
exports.getRegister = (req, res) => {
  res.render('register', { error: null }); // Inicialmente sem erro
};

// Processo de Registro
exports.postRegister = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.render('register', { error: 'Nome de usuário indisponível. Tente outro.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
  }
};

// Processo de Login
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render('login', { error: 'Usuário não encontrado.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render('login', { error: 'Senha incorreta.' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Ocorreu um erro ao fazer login. Tente novamente.' });
  }
};
