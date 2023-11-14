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
// const AjouterUnManga = require('./models/AjouterUnManga');
const Inscription = require('./models/Inscription');
const Manga = require('./models/Manga');




mongoose.connect(url,{
    useNewUrlParser: true,
    UseUnifiedTopology: true
}).then(console.log("MongoDB connected !"))
.catch(err => console.log(err))


// multer

const multer = require('multer');

// const app = express();

// Définir le répertoire de stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Spécifiez le répertoire de stockage des images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Utilisez un nom de fichier unique
  },
});

const upload = multer({ storage });

// Route pour gérer le téléchargement de l'image
app.post('/upload', upload.single('image'), (req, res) => {
  // Le fichier image est maintenant téléchargé et stocké dans le répertoire spécifié
  // Vous pouvez également enregistrer le chemin d'accès à l'image dans votre base de données si nécessaire
  res.json({ message: 'Image téléchargée avec succès' });
});



// cookie parser

const cookieParser = require('cookie-parser')
app.use(cookieParser())
const {createToken, validateToken} = require("./JWT")


const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// app.get('/AjouterUnManga', function(req, res){
//     res.render('AjouterUnManga')
// });

// app.get('/Accueil', function(req, res){
//     res.render('Accueil')
// });

// app.get('/Editer', function(req, res){
//     res.render('Editer')
// });

// app.get('/Contact', function(req, res){
//     res.render('Contact')
// });




// ---------------------------Mangas----------------------------



// app.get('/ajouterunmanga', function(req, res){
//     res.render('AjouterUnManga');
// });

app.post('/submit-ajouterunmanga', function(req, res){
    console.log(req.body);
     

    const Data = new Manga({
        titre : req.body.titre,
        auteur : req.body.auteur,
        genre : req.body.genre,
        anneedeparution : req.body.anneedeparution,
        description : req.body.description,
    })
    Data.save().then(() => {
        console.log("Data save successfully !");
        res.redirect('http://localhost:3000/allcatalogue/');
    }).catch(err => { console.log(err)});

});

// app.get('/ajouterunmanga', function(req, res) {
//     AjouterUnManga.find()
//     .then(data =>{
//         console.log(data);
//         // res.render('Accueil', {data: data});
//         res.json(data);


//     })
//     .catch(err => console.log(err))
// });

app.get('/allcatalogue', function(req, res) {
    Manga.find()
    .then(data =>{
        console.log(data);
        // res.render('Accueil', {data: data});
        res.json(data);


    })
    .catch(err => console.log(err))
});



app.get('/manga/:id', function (req, res){
    console.log(req.params.id);
    Manga.findOne({
        _id: req.params.id
    }).then(data =>{
        // res.render('Editer', {data: data});
        res.json(data);
    })
    .catch(err => console.log(err))
});

app.put('/allcatalogue/edit/:id', function (req, res) {
    console.log(req.params.id);
    const Data = {
        titre : req.body.titre,
        auteur : req.body.auteur,
        genre : req.body.genre,
        anneedeparution : req.body.anneedeparution,
        description : req.body.description,
    }
    Manga.updateOne({_id: req.params.id}, {$set: Data})
    .then(data =>{
        console.log("Data updated");
        res.redirect('http://localhost:3000/allcatalogue/')

    })
    .catch(err =>console.log(err));

});

app.delete('/allcatalogue/delete/:id', function(req, res){
    Manga.findOneAndDelete({_id: req.params.id})
    .then(()=>{
        // console.log("Data delete");
        res.redirect('http://localhost:3000/allcatalogue/')
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
    // res.render('Login');
});
app.post('/api/login', function(req, res) {
    Inscription.findOne({
        email : req.body.email
    }).then((Inscription) => {
            if(!Inscription)
            {
                res.send('No User found');
            }

            const accessToken = createToken(Inscription);

            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60* 24 * 30,
                httpOnly: true
            });
            // res.json("LOGGED IN !")
            res.redirect("http://localhost:3000/MangaTheque")



            if(!bcrypt.compareSync(req.body.motdepasse,Inscription.motdepasse)){
                res.send('Invalid password !')
            } else {
                console.log('Redirection vers http://localhost:3000/MangaTheque');
                return res.redirect("http://localhost:3000/MangaTheque");
            }    
            // if(!user || user.password !== req.body.password )
            // {
            //         res.send('Invalid password or user')
            // } else {
            //         console.log('User found!')
            //         res.render('UserPage', {data: user});
            // }
        }).catch((error)=>{
            console.log(error)});
});


var server = app.listen(5000, function() {
    console.log("Server listening on port 5000");
});




