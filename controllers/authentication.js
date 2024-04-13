const utente = require("../models/utente");
const jwt = require('jsonwebtoken');



const login = async function(req, res){
  let user = await utente.findOne({ mail : req.body.mail}).exec()

  if(!user){
      return res.status(400).json({success: false, message : 'Mail non corretta!'})
  }

  if(user.password != req.body.password){
      return res.status(400).json({success: false, message : 'Password non corretta!'})
  }

  var payload = {mail: user.mail, utente_id: user.utente_id};
  var options = {expiresIn: 23200};
  var tkn = jwt.sign(payload, 'EasyLib', options);
  return res.status(200).json({success: true, message : 'Welcome on your account, ' + user.mail + '!', token: tkn, utente_id: user.utente_id})
}

module.exports = {
  login
};