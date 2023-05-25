var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const parser = bodyParser.urlencoded({ extended: true });
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const userSchema = require('../models/user');
const productSchema = require('../models/product');
router.use(parser);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('home', { layout: 'login' })
})

router.get('/manage', async (req, res) => {
    if(req.cookies.jwt){
        const user = await userSchema.findOne({_id: req.cookies.jwt});
        const product = await productSchema.find();
        let checkAdmin = false;
        res.render('home', { layout: 'manage' , user: user, product: product })
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
        if(user.role == 'admin'){
            const product = await productSchema.find();
            res.render('home', { layout: 'product' ,product: product})
        }else{
            return res.redirect('/');
        }
    }else{
        return res.redirect('/');
    }
    
})

router.get('/productDetails/:id',async (req, res) => {
    await productSchema.findOne({_id: req.params.id}).then((product) => {
        userSchema.findOne({_id: req.cookies.jwt}).then((user) => {
            res.render('home', { layout: 'prdetail' ,product: product,user: user });
        })
        
    })
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

router.post('/addProduct',upload.single('myFile'), async (req, res) => {
    const body = req.body;
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType: req.file.mimetype,
        data: encode_img
    };
    await productSchema.insertMany({name: body.name,brand: body.brand,price: body.price,quantyti: body.quantyti,price: body.price,descaption: body.descaption,img: final_img})
    res.redirect('/product')
})

router.post('/updateProduct/:id', upload.single('myFile'), async (req,res) => {
    const body = req.body;
        if(req.file){
            var img = fs.readFileSync(req.file.path);
            var encode_img = img.toString('base64');
            var final_img = {
                contentType: req.file.mimetype,
                data: encode_img
            }
            await productSchema.updateOne({_id: req.params.id},{$set: {name: body.name,brand: body.brand,price: body.price,quantyti: body.quantyti,price: body.price,descaption: body.descaption,img: final_img}})
        }else{
            await productSchema.updateOne({_id: req.params.id},{$set: {name: body.name,brand: body.brand,price: body.price,quantyti: body.quantyti,price: body.price,descaption: body.descaption}})
        }
    res.redirect('/product')
})
router.get('/deleteProduct/:id', upload.single('myFile'), async (req,res) => {
    await productSchema.deleteOne({_id: req.params.id})
    res.redirect('/product')
})
module.exports = router;