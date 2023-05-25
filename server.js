const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ngkhacdai:a012675921@assignmentmob402.mbfbglm.mongodb.net/shoplaptop');
const expressHbs = require('express-handlebars');
const apiRoute = require('./routes/api.js')
const indexRoute = require('./routes/index.js')
app.use(express.static('public'))
app.engine('hbs', expressHbs.engine({
    extname: 'hbs',
    defaultLayout: 'layouts',
    layoutDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowedProtoMethodsByDefault: true
    },
    helpers: {
        checkAdmin: function(v1,options){
            if(v1 == 'admin'){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        },
        checkGuest: function(v1,options){
            if(v1 == 'guest'){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        },
    }
}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.use('/', indexRoute);

app.listen(port, () => {
    console.log('app listening on port ' + port);
})