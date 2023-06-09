const mongoose = require('mongoose')

const inscriptionSchema = mongoose.Schema({
    nom: {type : 'String', required: true},
    prenom: {type : 'String'},
    email: {type : 'String', required: true},
    motdepasse: {type : 'String'}
})

module.exports = mongoose.model('Inscription', inscriptionSchema);