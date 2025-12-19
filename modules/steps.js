const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');
const ejs = require('ejs');
const e = require('express');


//steps lehívása
router.get("/", (req, res)=>{
    query('SELECT * FROM steps WHERE user_id=?', [req.session.loggedUser.id], (err, results) => {
       if (err) {
        return res.status(500).send('Database query error');
        }
        console.log(results);
      ejs.renderFile('view/steps.ejs', { session: req.session, results }, (err, html) => {
                  if (err) {
                    return res.status(500).send("Szerver hiba" +err);
                  }
                  res.send(html)
    });
    });
})
//steps módosítás Form
router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    query('SELECT * FROM steps WHERE id=?', [id], (err, results) => {
        if (err || results.length === 0) {
            req.session.error = 'Hiba történt a betöltésnél!'
            req.session.severity = 'danger'
            return res.redirect('/steps');
        }
        ejs.renderFile('view/steps-edit.ejs', { session: req.session, id: id ,data: results[0]  }, (err, html) => {
            if (err) {
                res.status(500).send('Error rendering page' + err);
            } else {
                req.session.error = '';
                res.send(html);
            }
        });
    });
});
//step update
router.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { date, steps } = req.body;
    query('UPDATE steps SET date = ?, steps = ? WHERE id = ?', [date, steps, id], (err, results) => {
        if (err) {
            req.session.error = 'Hiba történt a frissítésnél!'
            req.session.severity = 'danger'
            return res.redirect('/steps/edit/' + id);
        }
        req.session.error = 'Sikeres frissítés!'
        req.session.severity = 'success'
        res.redirect('/steps');
    });
});
//step delete form
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    query('SELECT * FROM steps WHERE id=?', [id], (err, results) => {
        if (err || results.length === 0) {
            req.session.error = 'Hiba történt a betöltésnél!'
            req.session.severity = 'danger'
            return res.redirect('/steps');
        }
        ejs.renderFile('view/steps-delete.ejs', { session: req.session, id: id ,data: results[0]  }, (err, html) => {
            if (err) {
                res.status(500).send('Error rendering page' + err);
            } else {
                req.session.error = '';
                res.send(html);
            }
        });
    });
});
//step delete  
router.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    query('DELETE FROM steps WHERE id = ?', [id], (err, results) => {
        if (err) {
            req.session.error = 'Hiba történt a törlésnél!'
            req.session.severity = 'danger'
            return res.redirect('/steps');
        }
        req.session.error = 'Sikeres törlés!'
        req.session.severity = 'success'
        res.redirect('/steps');
    });
});
//steps new form
router.get('/new', (req, res) => {
    ejs.renderFile('view/steps-new.ejs', { session: req.session, data: {} }, (err, html) => {
        if (err) {
            res.status(500).send('Error rendering page' + err);
        }
        else {
            req.session.error = '';
            res.send(html);
        }
    });
});

//steps new post
router.post('/new', (req, res) => {
  const { date, steps } = req.body;
  const userId = req.session.loggedUser.id;

  query('SELECT * FROM steps WHERE user_id=? AND date=?', [userId, date], (err, results) => {
    if (err) {
      req.session.error = 'Hiba történt a lekérdezésnél!';
      req.session.severity = 'danger';
      return res.redirect('/steps');
    }

    if (results.length > 0) {
      query('UPDATE steps SET steps=? WHERE user_id=? AND date=?', [steps, userId, date], (err2, results2) => {
        if (err2) {
          req.session.error = 'Hiba történt a frissítésnél!';
          req.session.severity = 'danger';
          return res.redirect('/steps');
        }
        req.session.error = 'Lépés frissítve!';
        req.session.severity = 'success';
        res.redirect('/steps');
      });
    } else {
      query('INSERT INTO steps (date, steps, user_id) VALUES (?, ?, ?)', [date, steps, userId], (err3, results3) => {
        if (err3) {
          req.session.error = 'Hiba történt a hozzáadásnál!';
          req.session.severity = 'danger';
          return res.redirect('/steps');
        }
        req.session.error = 'Sikeres hozzáadás!';
        req.session.severity = 'success';
        res.redirect('/steps');
      });
    }
  });
});



//stats
router.get("/chart", (req, res) => {
  query('SELECT * FROM steps WHERE user_id=?', [req.session.loggedUser.id], (err, results) => {
    if (err) return res.status(500).send('Database query error');

    ejs.renderFile('view/chart.ejs', { session: req.session, results }, (err, html) => {
      if (err) return res.status(500).send("Szerver hiba: " + err);
      res.send(html);
    });
  });
});

//calendar
router.get("/calendar", (req, res)=>{
   query('SELECT * FROM steps WHERE user_id=?', [req.session.loggedUser.id], (err, results) => {
    if (err) return res.status(500).send('Database query error');

    ejs.renderFile('view/calendar.ejs', { session: req.session, results }, (err, html) => {
      if (err) return res.status(500).send("Szerver hiba: " + err);
      res.send(html);
    });
  });
})

module.exports = router;