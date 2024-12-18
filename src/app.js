const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const path = require('path');

require('dotenv').config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parse de dados do formulário
app.use(express.static('public')); // Arquivos estáticos
app.use(session({
  secret: process.env.SECRET_KEY || 'segredo_secreto', // Chave secreta para a sessão
  resave: false,
  saveUninitialized: false
}));

// Configurações do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas de Autenticação
app.use(authRoutes);

// Middleware para proteger rotas
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Dashboard protegido
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { username: req.session.username });
});

// Rota de logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Erro ao deslogar');
    res.redirect('/login');
  });
});

// Teste de conexão ao banco e sincronização do modelo
sequelize.sync().then(() => {
  console.log('SQLite conectado e sincronizado!');
}).catch((err) => {
  console.error('Erro ao conectar ao SQLite:', err);
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
