var crypto = require('crypto'),
    algorithm = 'aes192',
    password = 'mydate123456789';
   
    
/*var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "narendra.shantiinfotech@gmail.com",
        pass: "shantiinfotech1"
    }
});  
var handlebars = require('handlebars');
var fs = require('fs');
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};      
        */
module.exports = {
	
 encrypt:function(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
},

decrypt:function(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
  }
  
};
