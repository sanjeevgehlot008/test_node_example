var express = require('express');
var router = express.Router();
var sms = require('./../model/sms');
var phone = require('node-phonenumber')

var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: '345271454776727A622B384B53382B323356507233673D3D'
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/send', function(req, res, next) {
try{
var reqObj = req.body;  

var phoneUtil = phone.PhoneNumberUtil.getInstance();
var phoneNumber = phoneUtil.parse(reqObj.phone,'IR');
var toNumber = phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.INTERNATIONAL);
 
//
var phone_number = toNumber.replace(/ /g,'');
	console.log(phone_number);
	
	/* api.Send({
        message :  reqObj.message,
        sender: "10008727",
        receptor: reqObj.phone
    },
    function(response, status) {
        console.log(response);
        console.log(status);
    });
	 */
	 
	 
 	api.VerifyLookup({
		receptor: phone_number,
		token: reqObj.message,
		template: "registerlogin"
	}, function(response, status) {
		console.log(response);
		console.log(status);
		  if(status==200){
			var data = {receiver_number: phone_number, SMS_text:reqObj.message, sent_time:response[0].date, sms_status:"Sent", sender_number:response[0].sender, messageid:response[0].messageid };
			/*console.log(data);*/
			sms.create(data, function(err, data){
				//console.log("created");
				//console.log(data);
				
				res.json({"status":"true","Response":"Message sent Successfully"});
				
			})
		}  
		else{
			res.json({"status":"false","Response":"Please try again!"});
		}
	}); 

	

}

catch(ex){
//console.error("Internal error:"+ex);
return next(ex);
}


});


router.get('/viewsendsms', function(req, res, next) {

sms.find(function(err, data){
	  res.json({"Response" : data});
  });

	

});



module.exports = router;
