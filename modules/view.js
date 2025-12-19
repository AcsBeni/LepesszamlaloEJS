const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');
var SHA1 = require("crypto-js/sha1");
ejs = require('ejs');

 
// login form
router.get("/login", (req, res) => {
  res.render('login');
});
//login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,[email, SHA1(password).toString()],(error, results) => {
      if (error) {
        req.session && (req.session.error = 'Hiba történt a bejelentkezéskor!');
        req.session && (req.session.severity = 'danger');
        return res.redirect('/login')
      }
      if (results.length === 0) {
        req.session && (req.session.error = 'Hibás email vagy jelszó!');
        req.session && (req.session.severity = 'danger');
        return res.redirect('/login')
      }
      const loggedUser = results[0];
      if (loggedUser) {
        req.session.loggedUser = loggedUser;
        req.session && (req.session.error = 'Sikeres bejelentkezés!');
        req.session && (req.session.severity = 'success');
        const acceptsJson = req.headers.accept && req.headers.accept.indexOf('application/json') !== -1;
        if (acceptsJson) {
          return res.status(200).json({ id: loggedUser.id, name: loggedUser.name, email: loggedUser.email });
        }
        return res.render('profile', { user: loggedUser, success: 'Sikeres bejelentkezés!' });
      }
    },
    req);
})
// registration form
router.get("/registration", (req, res) => {
  res.render('registration');
});
//Registration
router.post("/registration", (req, res) => {
  const { name, password, email } = req.body;

  query(`SELECT * FROM users WHERE email = ?`, [email], (error, results) => {
    if (error) {
      req.session && (req.session.error = 'Adatbázis hiba a regisztrációnál!');
      req.session && (req.session.severity = 'danger');
      return res.redirect('/registration');
    }

    if (results.length > 0) {
      req.session && (req.session.error = 'Ez az e-mail cím már létezik!');
      req.session && (req.session.severity = 'danger');
      return res.redirect('/registration');
    }
    query(
      `INSERT INTO users(name, password, email) VALUES (?, ?, ?)`,
      [name, SHA1(password).toString(), email],
      (insertError, insertResults) => {
        if (insertError) {
          req.session && (req.session.error = 'Hiba történt a regisztrációnál!');
          req.session && (req.session.severity = 'danger');
          return res.redirect('/registration');
        }
        req.session && (req.session.error = 'Sikeres regisztráció!');
        req.session && (req.session.severity = 'success');
        return res.redirect('/login');
      }
    );
  });
});
// profile
router.get("/profile", (req, res) => {
    query('SELECT * FROM users WHERE id = ?', [req.session.loggedUser.id], (err, results) => {
       if (err) {
        return res.status(500).send('Database query error');
        }
        res.render('profile', { user: results[0] });
    
    });
  
});

// logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
//dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.loggedUser) {
    return res.redirect('/login');
  }
  const userId = req.session.loggedUser.id;
  query('SELECT * FROM steps WHERE user_id=? ORDER BY date ASC', [userId], (err, results) => {
    if (err) return res.status(500).send('Database error: ' + err);
    res.render('dashboard', { session: req.session, results });
  });
});
module.exports = router;
