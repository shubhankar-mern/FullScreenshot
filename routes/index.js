const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');

router.get('/', (req, res) => {
  const message = req.flash('message');
  res.render('home', { title: 'Home', message:message });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
  });

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

router.post('/generate',controllers.download);


module.exports = router;