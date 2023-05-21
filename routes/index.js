var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const parser = bodyParser.urlencoded({ extended: true });
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const userSchema = require('../models/user');
const user = require('../models/user');
router.use(parser);

router.get('/', (req, res) => {
    res.render('home', { layout: 'login' })
})

router.get('/manage', async (req, res) => {
    if(req.cookies.jwt){
        const user = await userSchema.findOne({_id: req.cookies.jwt});
        let checkAdmin = false;
        if(user.role == 'admin'){
            checkAdmin = true;
        }else{
            checkAdmin = false;
        }
        res.render('home', { layout: 'manage' , user: user, checkAdmin: checkAdmin })
    }else{
        return res.redirect('/');
    }
    
})

router.get('/logout', (req, res) => {
    res.cookie("jwt", '',{httpOnly: true});
    return res.redirect('/');
})

router.get('/product', async (req, res) => {
    if(req.cookies.jwt){
        const user = await userSchema.findOne({_id: req.cookies.jwt});
        let checkAdmin = false;
        if(user.role == 'admin'){
            res.render('home', { layout: 'product' })
        }else{
            return res.redirect('/');
        }
    }else{
        return res.redirect('/');
    }
    
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
        res.cookie("jwt", a._id,{httpOnly: true});
        return res.redirect('/manage');
    } else {
        return res.redirect('/');
    }
});
module.exports = router;