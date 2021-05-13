const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocal = require('passport-local')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const User = require('./models/user')
const userRoutes = require('./routes/users')
const movieRoutes = require('./routes/movies')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// database
mongoose.connect('mongodb://localhost/userMovies', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

// passport
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // flash
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    // access current user
    res.locals.currentUser = req.user

    next()
})

// home
app.get('/', (req, res) => {
    res.redirect('/movies')
})

app.use('/users', userRoutes)
app.use('/movies', movieRoutes)
app.use(express.static(__dirname + '/public'))

app.listen(3001, () => {
    console.log(`User Movies on Port: 3001`);
})
