const express = require('express');
var session = require('express-session')
const sql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

require('dotenv').config();

const app = express();

app.use(session({
    secret: 'your-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false ,maxAge: 24 * 60 * 60 * 1000,}
 }))
app.use(
    express.urlencoded({extended:false}),
    express.static('public'),
    express.json(),
    bodyParser.json()
)

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// sql connection
const connection = sql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

connection.connect(err=>{
    if (err) return console.log('database connect error: ',err);
    console.log('database connected');
})

//connection.query("insert into menus values(null,'Fired Rice',59,'http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSkbwGThbNVsH6S4fAcvSC1R35rnW8Oh69Ws_sGQ98BUhjM1V_4vibC7IJnMu0Vna5Op27Dn9ezcxyYk5FMuiU','Recommend')")

// server router
app.get('/',(req,res)=>{
    connection.query("select * from menus",(err,result)=>{
        res.render('index',{menus: result});    
    });
});

app.get('/admin',(req,res)=>{
    if(req.session.login){
        connection.query("select * from menus",(err,result)=>{
            res.render('admin',{menus: result});   
        });
    }else{
        res.render('login');
    }
})

app.post('/api/login',(req,res)=>{
    connection.query(`select * from admin where id=0`,(err,result)=>{
        bcrypt.compare(req.body.password,result[0].password,(err,hashResult)=>{
            if(hashResult){
                req.session.login = true;
                res.redirect('/admin');
            }else{
                res.redirect('/admin');
            }
        })
    })
})

app.post('/api/menus',(req,res)=>{
    if(!req.session.login) return res.redirect('/admin');
    connection.query("select * from menus",(err,result)=>{
        res.send(result);
    })
})

app.post('/api/update/menu',(req,res)=>{
    if(!req.session.login) return res.redirect('/admin');
    const req_data = req.body;
    if(req_data.id=='add'){
        connection.query(`insert into menus values(null,'${req_data.menu}',${req_data.price},'${req_data.image}','${req_data.tag}')`,(err,result)=>{
            if(err) console.log(err);
            else res.redirect('/admin');
        })
    }else{
        connection.query(`update menus set menu='${req_data.menu}',price=${req_data.price},image='${req_data.image}',tag='${req_data.tag}' where id=${req_data.id}`,(err,result)=>{
            if(err) console.log(err);
            else res.redirect('/admin');
        })
    }
})

app.post('/api/remove/menu',(req,res)=>{
    if(!req.session.login) return res.redirect('/admin');
    const req_data = req.body;
    console.log(req_data);
    connection.query(`delete from menus where id=${req_data.id}`,(err,result)=>{
        if(err) console.log(err);
        else res.send({result:'success'});
    })
})

// 404 not found
app.use('/', (req, res)=>{
    res.status(404).render('404');
});

app.listen(3000, () => console.log('server is running...✅'));

