const session = require('express-session')


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated() ) {
        req.flash('error', 'you must be signed in to view your movies')
        res.redirect('/users/login')
    }
    next()
}
