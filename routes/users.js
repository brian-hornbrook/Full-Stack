
const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')


// register
router.get('/register', (req, res) => {
    res.render('users/register', { user: req.user })
})
router.post('/register', async (req, res, next) => {
    const username = req.body.email
    const password = req.body.password

    if (!username.length || !password.length) {
        req.flash('error', 'username and password must not be blank')
        res.redirect('register')
    } else {
        try {
            // create user
            const user = new User({ username: username })
            const newUser = await User.register(user, password)

            if (username && password) {
                // log in user
                req.logIn(newUser, err => {
                    if (err) return next(err)
                    req.flash('success', 'Successfully Registered and Logged In')
                    req.flash('error', "didn't log in")
                    res.redirect('../movies')
                })
                next()
            }
        } catch {
            req.flash('error', "username or password has already been taken")
            res.redirect('register')
        }
        next()
    }

})


// login
router.get('/login', (req, res) => {
    res.render('users/login', { user: req.user })
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
    req.flash('success', 'Successfully Signed in')
    res.redirect('/movies')
})

// log out
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'succesfully signed out')
    res.redirect('/users/login')
})


module.exports = router
