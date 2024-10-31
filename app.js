const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

// Configuração do mecanismo de visualização e middlewares
app.set('view engine', 'ejs'); // Se estiver usando EJS para views
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'seuSegredo',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true em produção com HTTPS
}));

// Middleware de autenticação
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
}

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Verificação de credenciais simulada
  if (username === 'admin' && password === 'password123') {
    req.session.isAuthenticated = true;
    req.session.username = username;
    
    // Setando um cookie
    res.cookie('loggedIn', 'true', { maxAge: 900000, httpOnly: true });
    
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Credenciais inválidas' });
  }
});

// Rota de login (formulário)
app.get('/login', (req, res) => {
    res.render('login', { error: '' });
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simulação de verificação de credenciais
    if (username === 'admin' && password === 'password123') {
      req.session.isAuthenticated = true;
      req.session.username = username;
      
      // Setando um cookie
      res.cookie('loggedIn', 'true', { maxAge: 900000, httpOnly: true });
      
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Credenciais inválidas' });
    }
  });
  

// Rota protegida
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { username: req.session.username });
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid'); // Limpa o cookie de sessão
    res.redirect('/login');
  });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
