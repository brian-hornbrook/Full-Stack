const express = require('express')
const { models } = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const Movie = require('../models/movie')
const { isLoggedIn } = require('../middleware')


// index
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const currentUser = req.user._id
        const user = await User.findById(req.user._id).populate('movies')
        return res.render('movies/movies', { user: user })

    } catch {
        next()
    }
})

// new movie form
router.get('/new', isLoggedIn, async (req, res, next) => {
    try {
        const currentUser = req.user._id
        const user = await User.findById(currentUser).populate('movies')
        return res.render('movies/new', { user: req.user })

    } catch {
        next()
    }
})
// add new movie
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        const movie = new Movie(req.body.movie)
        user.movies.push(movie)
        await movie.save()
        await user.save()
        res.redirect('/movies')

    } catch {
        next()
    }
})

// update movie form
router.get('/update/:id', isLoggedIn, async (req, res, next) => {
    try {
        const thisUser = await User.findById(req.user._id)
        const thisMovie = await Movie.findById(req.params.id)
        res.render('movies/update', { user: thisUser, movie: thisMovie })

    } catch {
        next()
    }
})
// update movie
router.put('/update/:id', isLoggedIn, async (req, res, next) => {
    try {
        await Movie.findByIdAndUpdate(req.params.id, req.body.movie)
        res.redirect('/movies')

    } catch {
        next()
    }
})


// Delete
router.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const movieId = req.params.id
        await User.findByIdAndUpdate(req.user._id, { $pull: { movies: movieId } })
        await Movie.findByIdAndDelete(movieId)
        res.redirect('/movies')

    } catch {
        next()
    }
})



module.exports = router
