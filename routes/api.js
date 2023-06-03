var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const parser = bodyParser.urlencoded({ extended: true });
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const cartSchema = require('../models/cart');
const cartItemSchema = require('../models/cartitem');
const userSchema = require('../models/user');
const productSchema = require('../models/product');
const orderSchema = require('../models/order');
const orderItemSchema = require('../models/orderitem');
const { request } = require('http');
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

router.get('/getAllProduct',async (req, res) => {
    res.send(await productSchema.find());
})

router.get('/findProductByID/:id', async (req, res) => {
    await productSchema.findOne({_id: req.params.id}).then((product)=>{
        console.log(product._id);
        res.send(product)
    })
        
})

router.post('/addToCart/:id' , async (req, res) => {
    if(req.body.id){
        
        await cartSchema.findOne({user_id: req.body.id}).then(cart =>{
            cartItemSchema.findOne({cart_id: cart._id,product_id: req.params.id}).then((cartItem) => {
                if(cartItem){
                    console.log('Sản phẩm đã có trong cửa hàng');
                }else{
                    cartItemSchema.insertMany({cart_id: cart._id,product_id: req.params.id,quantyti: 1}).then((item)=> {
                        console.log('Đã thêm thành công');
                    })
                }
            })
    
        })
        
    }
    
})

router.post('/login', async (req, res) => {
    const body = req.body.newobj;
    const a = await userSchema.findOne({ email: body.username, password: body.password });
    res.send(a);
})

router.post('/register', async (req, res) => {
    const body = req.body.newobj;
    await userSchema.insertMany({ name: body.name, email: body.email, phone: body.phone, password: body.password, address: body.address, sex: body.sex, role: 'user' })
    await userSchema.findOne({email: body.email, password: body.password}).then((user) => {
        cartSchema.insertMany({user_id: user._id})
    })
})

router.get('/checkCookie' , (req, res) => {
    res.send(req.cookies.jwt)
})

router.post('/getitemincart', async (req, res) =>{
    let list = [];
    let listCartItem = [];
    if(req.body.id){
        await cartSchema.findOne({user_id: req.body.id}).then((cart) => {
            cartItemSchema.find({cart_id: cart._id}).then((cartItem) => {
                for(let i =0 ; i< cartItem.length ; i++) {
                    list.push(cartItem[i].product_id);
                }
                productSchema.find({_id: {
                    $in: list
                }}).then((product) => {
                    for (let i = 0; i < product.length; i++) {
                        let a = product[i];
                        a.quantyti = cartItem[i].quantyti;
                        listCartItem.push(a);
                    }
                    res.send(listCartItem);
                });
            });
        })
    }
    
})

router.post('/removeitemincart', async (req, res) => {
    await cartSchema.findOne({user_id:req.body.user}).then((cart) => {
        cartItemSchema.deleteOne({cart_id: cart._id,product_id: req.body.id}).then((carti) =>{
            console.log(carti);
        })
        
    })
})


module.exports = router;