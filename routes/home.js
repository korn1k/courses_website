const { Router } = require('express');
const router = Router();

router.get('/', (req, res, next) => {
  // res.status(200);
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));

  res.render('index', {
    title: 'Home Page',
    isHome: true,
  });
});

module.exports = router;
