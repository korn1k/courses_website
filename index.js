const express = require('express');
const exphbs = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys');
const app = express();

// Register engine
app.engine(
  'hbs',
  exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
  })
);

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
});

// Use engine
app.set('view engine', 'hbs');

// Indicate a folder for pages
app.set('views', 'views');

// Select a folder for custom css/html
app.use(express.static(path.join(__dirname, 'public')));

// Select a folder for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Parser for req.body
app.use(express.urlencoded({ extended: true }));

// Set up session
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// File loader
app.use(fileMiddleware.single('avatar'));

// Add a shield for defence
app.use(csrf());

// Add flash
app.use(flash());

// Set up helmet package (it adds headers)
app.use(helmet());

// Set up compression
app.use(compression());

// Set up middleware for our pages
app.use(varMiddleware);
app.use(userMiddleware);

// Register our router
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// page 404
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
