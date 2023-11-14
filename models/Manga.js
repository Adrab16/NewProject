const mongoose = require('mongoose');

const mangaSchema = mongoose.Schema({
    titre: { type: 'String', required: true },
    auteur: { type: 'String' },
    genre: { type: 'String' },
    anneedeparution: { type: 'String' },
    description: { type: 'String' },
    image : {type : 'String'},
});

module.exports = mongoose.model('Manga', mangaSchema);
