var express = require('express');
var router = express.Router();
var sms = require('./../model/sms');
var KAVENEGAR_API_KEY = require('./../config/kavenegar');
var SMS_PERMISSION_AUTH_TOKEN = require('./../config/token');
var validator = require('validator');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/send', async(req, res, next)=> {
try{
var reqObj = req.body;  

	if(validator.isMobilePhone(reqObj.phone,'fa-IR') === true){
		if(SMS_PERMISSION_AUTH_TOKEN == reqObj.message){
				 await KAVENEGAR_API_KEY.VerifyLookup({
						receptor: reqObj.phone,
						token: reqObj.message,
						template: "registerlogin"
					}, function(response, status) {
						console.log(response);
						console.log(status);
						  if(status==200){
							var data = {receiver_number: reqObj.phone, SMS_text:reqObj.message, sent_time:response[0].date, sms_status:"Sent", sender_number:response[0].sender, messageid:response[0].messageid };
							console.log(data);
							sms.create(data, function(err, data){
								//console.log("created");
								console.log(err);
								console.log(data);
								
								res.json({"status":"true","Response":"Message sent Successfully"});
								
							});
						}  
						else{
							res.json({"status":"false","Response":"Please try again!"});
						}
					}); 
		}
		else{
			res.json({"status":"503-Service Unavailable | Your service is disabled"});
		}		
	}
	else{
		
		res.json({"status":"false","Response":"Please enter correct phone number!"});									
	}												



	
	/* KAVENEGAR_API_KEY.Send({
        message :  reqObj.message,
        sender: "10008727",
        receptor: reqObj.phone
    },
    function(response, status) {
        console.log(response);
        console.log(status);
    });
	 */
	 
	 
 	

	

}

catch(ex){
//console.error("Internal error:"+ex);
return next(ex);
}


});


router.get('/viewsendsms', async(req, res, next)=> {

await sms.find(function(err, data){
	  res.json({"Response" : data});
  });

	

});



module.exports = router;
