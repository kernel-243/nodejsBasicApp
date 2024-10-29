const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nom: { type: String, required: true },
  postnom: { type: String },
  prenom: { type: String },
  sexe: { type: String, required: true, enum: ['M', 'F'] },
  telephone: { type: String, required: true, match: /^[0-9]+$/ },
  indicatif: { type: String, required: true,},
  password:{type: String, default: null},
  passwordIsSet:{type: Boolean, default:false },
  
  email: { type: String, default: null },
  adresse: { type: mongoose.Schema.Types.ObjectId, ref: 'Adresse'},
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Agent', 'Proprietaire'],
    default: 'Agent'
  },
  lastTimeConnected: {
    type: Date,
    default: Date.now
  },
 

  dob: {
    type: Date,
  },
  nbEnfant: { type: Number, default: 0 },
  etat_civil: { type: String, default: null },
  regime_matrimonial: { type: String, default: null },
  conjoint: { type: Schema.Types.ObjectId, ref: "Conjoint", required: false },


  profile: {type: String,  default: 'uploads/avatar.jpg'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

UserSchema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName} ${this.secondName}`;
});


UserSchema.virtual('age').get(function () {
  const diff = Date.now() - this.dob.getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
}
);

UserSchema.virtual('timeConnect').get(function () {
  const diff = Date.now() - this.lastTimeConnected.getTime();
  const time = new Date(diff);
  return time.getUTCMinutes();
}
);


module.exports = mongoose.model('User', UserSchema);
