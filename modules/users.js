const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const {query} = require('../utils/database');
var SHA1 = require("crypto-js/sha1");


//userek lehívása
router.get("/", (req, res)=>{
  query(`SELECT * FROM users` ,[], (error, results) =>{
        if(error) return res.status(500).send({ error: "Hiba fordult elő"}) ;
         res.status(200).json(results)
    },req)
    
})
//user update id alapján
router.patch("/:id", (req, res)=>{
    let ID = req.params.id 
    const { name, password, email} = req.body;
    query(`UPDATE users SET name=?,password=?,email=? WHERE ID =?` ,[ name, password, email, ID], (error, results) =>{
      if(error) {
        req.session && (req.session.error = 'Hiba történt a felhasználó frissítésekor!');
        req.session && (req.session.severity = 'danger');
        return res.status(400).json({errno: error.errno, msg: "Hiba történt :("});
      }
      req.session && (req.session.error = 'Profil frissítve!');
      req.session && (req.session.severity = 'success');
      res.status(200).json(results)
    },req);
})
//user jelszó frissítése id alapján(Nagyon lassan frissül ez az npm, nem tudom miért, de nagyon sok időt vett el, az hogy a semmit debuggoltam)
router.post("/password/:id", (req, res) => {
  const ID = req.params.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    req.session.error = "Hiányzik a régi vagy új jelszó!";
    req.session.severity = "danger";
    return res.redirect('/profile');
  }

  if (newPassword !== confirmPassword) {
    req.session.error = "Az új jelszó és a megerősítés nem egyezik!";
    req.session.severity = "danger";
    return res.redirect('/profile');
  }

  if (oldPassword === newPassword) {
    req.session.error = "Az új jelszó nem egyezhet meg a régivel!";
    req.session.severity = "danger";
    return res.redirect('/profile');
  }
  query(
    "SELECT * FROM users WHERE ID = ? AND password = ?",
    [ID, SHA1(oldPassword).toString()],
    (err, results) => {
      if (err) {
        console.error(err);
        req.session.error = "Hiba történt az ellenőrzéskor!";
        req.session.severity = "danger";
        return res.redirect('/profile');
      }

      if (results.length === 0) {
        req.session.error = "Hibás régi jelszó!";
        req.session.severity = "danger";
        return res.redirect('/profile');
      }
      query(
        "UPDATE users SET password = ? WHERE ID = ?",
        [SHA1(newPassword).toString(), ID],
        (err2) => {
          if (err2) {
            console.error(err2);
            req.session.error = "Nem sikerült frissíteni a jelszót!";
            req.session.severity = "danger";
            return res.redirect('/profile');
          }

          req.session.success = "Jelszó sikeresen frissítve!";
          req.session.severity = "success";
          return res.redirect('/profile');
        }
      );
    }
  );
});
//user név,email frissítése id alapján
router.post("/profile/:id", (req, res)=>{
    let ID = req.params.id 
    const { name,email} = req.body;
    
    query(`SELECT * FROM users WHERE email = ? AND ID != ?`, [email, ID], (error, results) => {
    if (error) {
      console.error("[DB Error - email check]", error);
      req.session && (req.session.error = 'Adatbázis hiba az email ellenőrzésnél!');
      req.session && (req.session.severity = 'danger');
      return res.redirect('/profile');
    }

    if (results.length > 0) {
      req.session && (req.session.error = 'Ez az e-mail cím már használatban van!');
      req.session && (req.session.severity = 'danger');
      return res.redirect('/profile');
    }
    query(`UPDATE users SET name = ?, email = ? WHERE ID = ?`, [name, email, ID], (error2, updateResults) => {
      if (error2) {
        console.error("[DB Error - update]", error2);
        req.session && (req.session.error = 'Nem sikerült frissíteni az adatokat!');
        req.session && (req.session.severity = 'danger');
        return res.redirect('/profile');
      }
      query(`SELECT * FROM users WHERE ID = ?`, [ID], (error3, userResults) => {
        if (error3) {
          console.error("[DB Error - select updated user]", error3);
          req.session && (req.session.error = 'Hiba a felhasználó lekérésekor!');
          req.session && (req.session.severity = 'danger');
         return res.redirect('/profile');
        }

        if (userResults.length === 0) {
          req.session && (req.session.error = 'Felhasználó nem található!');
          req.session && (req.session.severity = 'danger');
          return res.redirect('/profile');
          
        }
        req.session && (req.session.error = 'Profil frissítve!');
        req.session && (req.session.severity = 'success');
        req.session.loggedUser = userResults[0];
        return res.redirect('/profile');
      });
    });
  });
});


//user törlése id alapján
router.delete("/:id", (req, res)=>{
    let id = req.params.id;
    query(`DELETE FROM users WHERE id=?` ,[id], (error, results) =>{
      if(error) {
        req.session && (req.session.error = 'Hiba történt a törlésnél!');
        req.session && (req.session.severity = 'danger');
        return res.status(500).send({error: "Nem sikerült törölni a felhasználót"});
      }
      req.session && (req.session.error = 'Felhasználó törölve.');
      req.session && (req.session.severity = 'success');
      res.status(200).json(results)
    },req);
})


module.exports = router;