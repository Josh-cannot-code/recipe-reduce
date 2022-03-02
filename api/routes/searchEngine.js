const express = require('express')
const router = express.Router()
const scrape = require('./../public/javascripts/scrape')
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/', (req, res) => {
    let searchTerm = req.body.search
    console.log(searchTerm)
    res.set('Content-Type', 'application/json')
    scrape(searchTerm)
        .then(val => {
            console.log(val)
            res.send(val)
        })
        .catch(err => console.log(err))
})

module.exports = router