var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const parser = bodyParser.urlencoded({ extended: true });
const userSchema = require('../models/user');
const user = require('../models/user');
router.use(parser);

router.get('/', (req, res) => {
    res.render('home', { layout: 'login' })
})

router.get('/manage', (req, res) => {
    res.render('home', { layout: 'manage' })
})

router.post('/signup', async (req, res) => {
    const body = req.body;
    await userSchema.insertMany({ name: body.name, email: body.email, phone: body.phone, password: body.pass, address: body.address, sex: body.sex, role: 'user' })
    res.redirect('/');
});

router.post('/signin', async (req, res) => {
    const body = req.body;
    const a = await userSchema.findOne({ email: body.email, password: body.password });
    if (a) {
        return res.redirect('/manage');
    } else {
        return res.redirect('/');
    }
});
module.exports = router;