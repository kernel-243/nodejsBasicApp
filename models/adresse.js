const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdresseSchema = new Schema({
  numero: { type: String, required: true },
    rue: { type: String, required: true },
    ville: { type: String, required: false, default: 'Kinshasa'},
    commune: { type: String, required: true },

    code_postal: { type: String, required: false },
    pays: { type: String, required: false, default: 'RDC'},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Adresse', AdresseSchema);
