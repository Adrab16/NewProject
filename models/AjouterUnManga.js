const mongoose = require('mongoose')

const ajouterunmangaSchema = mongoose.Schema({
    titre : {type: 'String', required: true},
    auteur : {type: 'String'},
    genre : {type: 'String'},
    anneedeparution : {type: 'String'},
    description : {type: 'String'},

})

module.exports = mongoose.model('AjouterUnManga', ajouterunmangaSchema);