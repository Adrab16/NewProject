var express = require('express');

var app = express();

var path = require('path');

const bcrypt = require('bcrypt');

const cors = require('cors');

app.use(cors())

require('dotenv').config();

// bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

app.set('view engine', 'ejs');

var mongoose = require('mongoose');
const url = process.env.DATABASE_URL
const AjouterUnManga = require('./models/AjouterUnManga');
const Inscription = require('./models/Inscription');


mongoose.connect(url,{
    useNewUrlParser: true,
    UseUnifiedTopology: true
}).then(console.log("MongoDB connected !"))
.catch(err => console.log(err))

// cookie parser

const cookieParser = require('cookie-parser')
app.use(cookieParser())
const {createToken, validateToken} = require("./JWT")


const methodOverride = require('method-override')
app.use(methodOverride('_method'));

app.get('/AjouterUnManga', function(req, res){
    res.render('AjouterUnManga')
});

app.get('/Accueil', function(req, res){
    res.render('Accueil')
});

app.get('/Editer', function(req, res){
    res.render('Editer')
});

app.get('/Contact', function(req, res){
    res.render('Contact')
});



app.get('/ajouterunmanga', function(req, res){
    res.sendFile(path.resolve('ajouterunmanga.html'));
});

app.post('/submit-ajouterunmanga', function(req, res){
    console.log(req.body);
     

    const Data = new AjouterUnManga({
        titre : req.body.titre,
        auteur : req.body.auteur,
        anneedeparution : req.body.anneedeparution,
        description : req.body.description,

    })
    Data.save().then(() => {
        console.log("Data save successfully !");
        res.redirect('http://localhost:3000/');
    }).catch(err => { console.log(err)});

});

app.get('/', function(req, res) {
    AjouterUnManga.find()
    .then(data =>{
        console.log(data);
        // res.render('Accueil', {data: data});
        res.json(data);


    })
    .catch(err => console.log(err))
});

app.get('/ajouterunmanga/:id', function (req, res){
    console.log(req.params.id);
    AjouterUnManga.findOne({
        _id: req.params.id
    }).then(data =>{
        // res.render('Editer', {data: data});
        res.json(data);
    })
    .catch(err => console.log(err))
});

app.put('/ajouterunmanga/edit/:id', function (req, res) {
    console.log(req.params.id);
    const Data = {
        titre : req.body.titre,
        auteur : req.body.auteur,
        anneedeparution : req.body.anneedeparution,
        description : req.body.description,
    }
    AjouterUnManga.updateOne({_id: req.params.id}, {$set: Data})
    .then(data =>{
        console.log("Data updated");
        res.redirect('/')

    })
    .catch(err =>console.log(err));

});

app.delete('/ajouterunmanga/delete/:id', function(req, res){
    AjouterUnManga.findOneAndDelete({_id: req.params.id})
    .then(()=>{
        // console.log("Data delete");
        res.redirect('/')
    })
    .catch(err =>console.log(err));
});


// Inscription
app.post('/submit-inscription', function(req, res) {
    const Data = new Inscription({
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        motdepasse : bcrypt.hashSync(req.body.motdepasse,10),
        utilisateur : false
    })
    Data.save().then((data)=>{
        console.log('User saved !');
        // res.render('UserPage', {data: data});
        res.redirect('http://localhost:3000/')
    })
    .catch(err=>console.log(err));
})
app.get('/inscription', function(req, res) {
    // res.render('Inscription')
});
app.get('/SeConnecter', function(req, res) {
    res.render('Login');
});
app.post('/api/SeConnecter', function(req, res) {
    Inscription.findOne({
        nom: req.body.nom
    }).then((Inscription) => {
            if(!Inscription)
            {
                res.send('No User found');
            }

            const accessToken = createToken(user);

            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60* 24 * 30,
                httpOnly: true
            })
            // res.json("LOGGED IN !")
            res.redirect("http://localhost:3000/Accueil")



            if(!bcrypt.compareSync(req.body.motdepasse,Inscription.motdepasse)){
                res.send('Invalid password !')
            }
            // console.log('User found!');
                res.redirect('/');
            // if(!user || user.password !== req.body.password )
            // {
            //         res.send('Invalid password or user')
            // } else {
            //         console.log('User found!')
            //         res.render('UserPage', {data: user});
            // }
        }).catch((error)=>{console.log(error)});
});


var server = app.listen(5000, function() {
    console.log("Server listening on port 5000");
});




