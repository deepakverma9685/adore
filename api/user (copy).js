
/*
 * GET users listing.
 */
 //const asyncFunc = require('asyncFunc');
date = require('date-and-time');
//var uploader = require('base64-image-upload');
const request = require('request');
const querystring = require('querystring');
const url = require('url');
var common = require('../common/function');
var d = new Date();
var c_date= date.format(d,'YYYY-MM-DD HH:mm:ss');
var base_url='http://localhost:8080/';
var FCM = require('fcm-node');

//*************************************************** Check access token start***********************************************************************//
function checkAccessToken(data,connection,callback){
	//var result;
  if(data.access_token=='')
    { var result; // return 'yes';
					var d = new Date();
					var token = d.getTime()+"pktip";
					
					var c_date= date.format(d,'YYYY-MM-DD HH:mm:ss');
					
					var sql = "INSERT INTO pt_devices (device_id, device_type,access_token,created_on,updated_on) VALUES ('"+data.device_id+"', '"+data.device_type+"','"+token+"','"+c_date+"','"+c_date+"')";
				 
					var query = connection.query(sql,function(err,rows,result){
						 if(err){
							  var result={
									status:2,
									message:'There are some technical issue.'
								   }
							   callback(result);   						     
						 }else{  var result={
									status:1,
									message:'success',
									token:token
									}
									callback(result);
							   //return result;
							  }
					  
					  });
					  // console.log(result);	
			//return result;	  
					       
				
     }else{
	    var query = connection.query('SELECT * FROM pt_devices WHERE device_id="'+data.device_id+'" AND device_type="'+data.device_type+'" AND access_token="'+data.access_token+'"',function(err,rows,result)
          {  //console.log
			    
			  if(rows.length >=1){
				  
				  if(data.uid!='' && data.uid !=rows[0].uid){
					   var d = new Date();
					   var u_date= date.format(d,'YYYY-MM-DD HH:mm:ss');
				       var query = connection.query('UPDATE * pt_devices SET uid="'+data.uid+'" ,updated_on="'+u_date+'"',function(err,results){
				       if(err){
						   var result={
							status:2,
							message:err
							}
						   callback(result); 
						 }
					  else{  
						 var result={
							status:1,
							message:'success',
							token:rows[0].access_token
							}
						 callback(result);
					 }
				 });
				}else{  
						 var result={
							status:1,
							message:'success',
							token:rows[0].access_token
							}
						callback(result);
			     }
			  }else{
				   var result={
							status:2,
							message:'Access token expired'
						   }
					  callback(result);
				  
				  }
		// console.log(result);		  
		});
	 	  
	 
     }
 }
 //************************************************** Check access token end**************************************************************************//
 
 
 //*************************************************** Send push notification start***********************************************************************//
function sendPushNotification(data,to){
	  var serverKey = 'AAAA3Y_njhI:APA91bHJTbGAztQcWkBCs2qqrr3EaaVmTM-5SeATgaLCRdU0SvNy0-3HlsqYeu8Eiy2QDWq63NDiMgVt1fqwIiH2gTQej-AZmfb4sX-r5ZFw3r2XVp535vilFOtNPgVQNWyjtEsUpL-t'; //put your server key here
     var fcm = new FCM(serverKey);
 
       var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to:to, 
        data: {  //you can send only notification or only data(or include both)
				data
		        }
    };
    
    fcm.send(message, function(err, response){
        if (err){
            return true;
        } else {
            return true;
        }
    });
	
 }
 //************************************************** Send push notification end**********************************************************************//
 
 
 
 
 //*********************************************************** Get language ****************************************************//
 exports.get_language = function(req, res){
            req.getConnection(function (err, connection){
				var parking_type_sql ="SELECT * FROM pt_language WHERE status='active'";
				var query = connection.query(parking_type_sql,function(car_err,rows){ 
				  if(car_err){
						  var ret_result={ status:2,message:car_err };
						  return res.send(ret_result);
					   }else{
					   var ret_result={ status:1,message:'Success',data:rows};
						  return res.send(ret_result);
					}
		 });
	 });
 }; 
 //************************************************************** Get language end ******************************************************//
 //*************************************************** Access token start *****************************************************************//
exports.access_token = function(req, res){
	//var hello=sayHelloInEnglish('');
	sendPushNotification();
//console.log(hello);
   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var data = {
		    uid:'',
		    access_token:'',
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(data,connection, function(result){
        if(result){
            return res.send(result);
          }else{
			  return res.send({status:2,message:'access token note generate'});
			  }   

             });
	    });
    }
  
 };
 //****************************************Access token end********************************************************************************************//
 //*********************************************************Check uniqe start*****************************************************************************//
exports.check_uniqe = function(req, res){
	
	
   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('first_name', 'First name is required').notEmpty();
   req.checkBody('last_name', 'Last name is required').notEmpty();
   req.checkBody('email', 'Email is required').notEmpty();
   req.checkBody('stdcode', 'Stdcode is required').notEmpty();
   req.checkBody('phone', 'phone is required').notEmpty();
   req.checkBody('password', 'Pasword token is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:'',
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   
			   var selectqry="SELECT email,phone FROM pt_users WHERE email='"+req.body.email+"' OR phone='"+req.body.phone+"'";
			   var query = connection.query(selectqry,function(err,result){
				 if(err){ 
					   var ret_result={ status:2,message:err };
                       return res.send(ret_result);
					 }else{  
						 if(result.length==0){
						            var ret_result={ status:1,message:'success' };
									return res.send(ret_result);
							}else{
								//console.log(fields);
								if(result[0].email==req.body.email){
									var ret_result={ status:2,message:'email alredy registered.' };
									return res.send(ret_result);
									}
								else if(result[0].phone==req.body.phone){
									var ret_result={ status:2,message:'Phone alredy registered.' };
									return res.send(ret_result);
									}	
								else{
									var ret_result={ status:2,message:'There are some technical issue. Try again' };
									return res.send(ret_result);
									}	
								
						    }
				       }
				   });	
            }else{
			  return res.send({status:2,message:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
 //******************************************************************* Check uniqe end*****************************************************************//
 
 
 
 //*********************************************************Registration start*****************************************************************************//
exports.registartion = function(req, res){

//~ upload(req,res,function(err) {
		//~ if(err) {
			//~ console.log("Error uploading file.");
		//~ }
		//~ console.log("File is uploaded");
	//~ });
	
   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('first_name', 'First name is required').notEmpty();
   req.checkBody('last_name', 'Last name is required').notEmpty();
   req.checkBody('email', 'Email is required').notEmpty();
   req.checkBody('stdcode', 'Stdcode is required').notEmpty();
   req.checkBody('phone', 'phone is required').notEmpty();
   req.checkBody('password', 'Pasword token is required').notEmpty();
   req.checkBody('car_brand', 'Brand is required').notEmpty();
   req.checkBody('car_model', 'Model is required').notEmpty();
   req.checkBody('car_color', 'Color is required').notEmpty();
   req.checkBody('licence', 'Licence is required').notEmpty();
   req.checkBody('category', 'Category is required').notEmpty();
   req.checkBody('country', 'Country is required').notEmpty();
   req.checkBody('city', 'City is required').notEmpty();
   req.checkBody('zipcode', 'Zipcode is required').notEmpty();
   req.checkBody('address', 'Address is required').notEmpty();
   req.checkBody('latitude', 'latitude is required').notEmpty();
   req.checkBody('longitude', 'longitude is required').notEmpty();
   req.checkBody('price_sharing', 'Sharing price is required').notEmpty();
   req.checkBody('price_receiving', 'Recievin price is required').notEmpty();
   req.checkBody('type_of_parking', 'Parking type is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:'',
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   
			   var selectqry="SELECT email,phone FROM pt_users WHERE email='"+req.body.email+"' OR phone='"+req.body.phone+"'";
			   var query = connection.query(selectqry,function(err,result){
				 if(err){ 
					   var ret_result={ status:2,message:err };
                       return res.send(ret_result);
					 }else{  
						 if(result.length==0){
						   var tokn = d.getTime();
						   var pass=common.encrypt(req.body.password);
						   var insertsql = "INSERT INTO pt_users(first_name,last_name,email,stdcode,phone,password,address,zipcode,city,country,latitude,longitude,price_sharing,price_receiving,type_of_parking,token,status,created_on) VALUES ('"+req.body.first_name+"','"+req.body.last_name+"','"+req.body.email+"','"+req.body.stdcode+"','"+req.body.phone+"','"+pass+"','"+req.body.address+"','"+req.body.zipcode+"','"+req.body.city+"','"+req.body.country+"','"+req.body.latitude+"','"+req.body.longitude+"','"+req.body.price_sharing+"','"+req.body.price_receiving+"','"+req.body.type_of_parking+"','"+tokn+"','inactive','"+c_date+"')";
							var query = connection.query(insertsql,function(err,results){
							if(err){
									 var result={ status:2,message:err };
									 return res.send(result);
								   }else{
									   
									      var carsql = "INSERT INTO pt_vehicles(user_id,car_brand,car_model,color,category,licence,type_of_parking,created_on,created_by) VALUES ('"+results.insertId+"','"+req.body.car_brand+"','"+req.body.car_model+"','"+req.body.car_color+"','"+req.body.category+"','"+req.body.licence+"','"+req.body.type_of_parking+"','"+c_date+"','"+results.insertId+"')";
									      var query = connection.query(carsql,function(car_err,car_result){ 
											  if(car_err){ }else{
												  //~ upload(req,res,function(err) {
														//~ if(err) {
															//~ console.log("Error uploading file.");
														//~ }
														//~ console.log("File is uploaded");
													//~ });
												  
												  var update_primary_car="UPDATE pt_users SET primary_car='"+car_result.insertId+"' WHERE id='"+results.insertId+"'";
												    
												      var query = connection.query(update_primary_car,function(update_primary_car,car_result){
													
													   });
												    }
											  
											  
											   });
									      
									      
									   //************************************************************************************//
									   
									   var mailOptions={
										        from: '<narendra.shantiinfotech@gmail.com> Parkingtips',
												to : req.body.email,
												subject : 'Parkingtip registartion'
												
											}
											var uid=common.encrypt(results.insertId.toString());
											var url=base_url+'activation?key='+uid+'&token='+tokn;
											var code='<a href="'+url+'" target="_blank" ><button id="stepverifycode" class="btn btn-primary" type="button" style="background-color: rgb(0, 39, 77); cursor: pointer; color: rgb(255, 255, 255);">Click here</button></a>';
											var mailres=common.send_mail(mailOptions,'/mails/register_user.html',req.body.first_name,code);
											
										    var result={status:1,message:'You are successfully registered',data:{uid:results.insertId}};
														 
									        return res.send(result);
														
									   //*************************************************************************************//
									   
									 
									}					
								});
							}else{
								//console.log(fields);
								if(result[0].email==req.body.email){
									var ret_result={ status:2,message:'email alredy registered.' };
									return res.send(ret_result);
									}
								else if(result[0].phone==req.body.phone){
									var ret_result={ status:2,message:'Phone alredy registered.' };
									return res.send(ret_result);
									}	
								else{
									var ret_result={ status:2,message:'There are some technical issue. Try again' };
									return res.send(ret_result);
									}	
								
						    }
				       }
				   });	
            }else{
			  return res.send({status:2,message:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
 //******************************************************************* Registartion end*****************************************************************//
 
 //************************************************************** Activate account start**********************************************************//
 
 exports.activate = function(req, res){

  var queryData = url.parse(req.url,true);
  var body=queryData.query;
  //console.log(body.key);
  var key=body.key;
   
	   req.getConnection(function (err, connection){
		    var uid=key.trim();
            var uid=common.decrypt(uid);
			var token=body.token;
			
					  //********* Access token update******************//
							  var update_status="UPDATE pt_users SET status='active',token='',updated_on='"+c_date+"' WHERE id='"+uid+"' AND token='"+token+"'";
							   var query = connection.query(update_status,function(err,car_result){
								   if(err){
										  var ret_result={ status:2,message:'there are some technical problem.'};
										  res.render('thankyou',ret_result);
									   }else{
										  var ret_result={ status:1,message:'success'};
										  res.render('thankyou',ret_result);
										 }
									});
					  //*********************************************//												    
								        
									  
				   });	
           
	   
  
 }; 
  //************************************************************** Activate account end*******************************************************//
  
   //************************************************************** Forgot password start*************************************************************//
 
 exports.forgotpass = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('email', 'Email is required').notEmpty();
   //req.checkBody('password', 'Password is required').notEmpty();
  
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:'',
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   //var pass=common.encrypt(req.body.password);
			   var selectqry="SELECT id,email,phone,first_name,last_name,status FROM pt_users WHERE email='"+req.body.email+"' AND status !='delete'";
			   var query = connection.query(selectqry,function(err,result){
				 if(err){ 
					   var ret_result={ status:2,errors:err };
                       return res.send(ret_result);
					 }else{  
						 if(result.length>=1){
						   //var pass=common.encrypt(req.body.password);
						      
								    if(result[0].status=='active'){
										        var tokn1 = d.getTime();
										        var tokn=tokn1.toString();
										        var count=tokn.length;
										        var sendtoken = tokn.substr(count-4,count);
										  //********* Access token update******************//
												  var update_accesstoken="UPDATE pt_users SET token='"+sendtoken+"',updated_on='"+c_date+"' WHERE id='"+result[0].id+"' AND email='"+req.body.email+"'";
												   var query = connection.query(update_accesstoken,function(err,car_result){
													   if(err){
														   var ret_result={ status:2,message:err,data:{}};
									                       return res.send(ret_result);
														   }
													     else{
															  var mailOptions={
																	from: '<narendra.shantiinfotech@gmail.com> Parkingtips',
																	to : req.body.email,
																	subject : 'Parkingtips Forgot password'
																	
																}
															 var code='OTP : '+sendtoken;
											                  var mailres=common.send_mail(mailOptions,'/mails/forgot_pass.html',result[0].first_name,code);
															 
															  var ret_result={ status:1,message:'success',data:{}};
									                           return res.send(ret_result);
															 }
													   
													   
													    });
										  //*********************************************//												    
								          
							              
									  }else{
										  var ret_result={ status:2,message:'Your status is inactive.',data:{}};
									      return res.send(ret_result);
										  }
							      
						 
							}else{
								
									var ret_result={ status:2,message:'email not registered.' };
									return res.send(ret_result);
						    }
				       }
				   });	
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
  //************************************************************** Forgot password end***************************************************************//
  
   //************************************************************** Reset password start*************************************************************//
 
 exports.resetpassword = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('email', 'Otp is expired').notEmpty();
   req.checkBody('otp', 'Enter your otp.').notEmpty();
   req.checkBody('password', 'Password is required.').notEmpty();
   req.checkBody('cpassword', 'Comnfirm password is required.').notEmpty();
   //req.checkBody('password', 'Password is required').notEmpty();
  
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:'',
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   
			   if(req.body.password===req.body.cpassword){
			   //var pass=common.encrypt(req.body.password);
			   var selectqry="SELECT id,email,first_name,status,token FROM pt_users WHERE email='"+req.body.email+"' AND status !='delete' AND token='"+req.body.otp+"'";
			   var query = connection.query(selectqry,function(err,result){
				 if(err){ 
					   var ret_result={ status:2,errors:err };
                       return res.send(ret_result);
					 }else{  
						 if(result.length>=1){
						   var pass=common.encrypt(req.body.password);
						      
								    if(result[0].status=='active'){
										
										        var tokn = d.getTime().toString();
										        var count=tokn.length;
										        var sendtoken = tokn.substr(count-4,count);
										  //********* Access token update******************//
												  var update_accesstoken="UPDATE pt_users SET password='"+pass+"',token='',updated_on='"+c_date+"' WHERE id='"+result[0].id+"' AND email='"+req.body.email+"'";
												   var query = connection.query(update_accesstoken,function(err,car_result){
													   if(err){
														   var ret_result={ status:2,message:err,data:{}};
									                       return res.send(ret_result);
														   }
													     else{
															  var ret_result={ status:1,message:'success',data:{}};
									                           return res.send(ret_result);
															 }
													   
													   
													    });
													 
										  //*********************************************//												    
								          
							              
									  }else{
										  var ret_result={ status:2,message:'Your status is inactive.',data:{}};
									      return res.send(ret_result);
										  }
							      
						 
							}else{
								
									var ret_result={ status:2,message:'Otp not matched.' };
									return res.send(ret_result);
						    }
				       }
				   });	
			   } 
			   else{
					  var ret_result={ status:0,message:'password and confirm password does not match',data:{}};
					   return res.send(ret_result);
					 
					 }  
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
  //************************************************************** Reset password end***************************************************************//
 
 //************************************************************** login start****************************************************************************//
 
 exports.login = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('username', 'Username is required').notEmpty();
   req.checkBody('password', 'Password is required').notEmpty();
   req.checkBody('fb_token', 'Firebase token is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:'',
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   var pass=common.encrypt(req.body.password);
			   var selectqry="SELECT id,email,phone,first_name,last_name,stdcode,password,primary_car,latitude,longitude,price_sharing,price_receiving,status FROM pt_users WHERE email='"+req.body.username+"' AND status !='delete'";
			   var query = connection.query(selectqry,function(err,result){
				 if(err){ 
					   var ret_result={ status:2,errors:err };
                       return res.send(ret_result);
					 }else{  
						 if(result.length>=1){
						   var pass=common.encrypt(req.body.password);
						      if(pass==result[0].password){
								    if(result[0].status=='active'){
										  //********* Access token update******************//
												  var update_accesstoken="UPDATE pt_devices SET uid='"+result[0].id+"',updated_on='"+c_date+"' WHERE device_id='"+req.body.device_id+"' AND device_type='"+req.body.device_type+"' AND access_token='"+req.body.access_token+"'";
												   var query = connection.query(update_accesstoken,function(update_primary_car,car_result){ });
										  //*********************************************//		
										  
										  //********* firabase token update******************//
												  var update_firebase_tkn="UPDATE pt_user SET fb_token='"+req.body.fb_token+"',updated_on='"+c_date+"' WHERE id='"+result[0].id+"'";
												   var query = connection.query(update_firebase_tkn,function(update_primary_car,car_result){ });
										  //*********************************************//	
										  
										  										    
								          delete result[0].password;
							              var ret_result={ status:1,message:'success',data:result[0]};
									      return res.send(ret_result);
									  }else{
										  var ret_result={ status:2,message:'Your status is inactive.',data:{}};
									      return res.send(ret_result);
										  }
							      }else{
								    var ret_result={ status:2,message:'password is incorrect.',data:{}};
									return res.send(ret_result);
								   
								   }
						 
							}else{
								
									var ret_result={ status:2,message:'Username or password is incorrect.' };
									return res.send(ret_result);
						    }
				       }
				   });	
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
  //************************************************************** login end****************************************************************************//
 //************************************************************** Add car start**********************************************************************//
 exports.add_cars = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'user id is required').notEmpty();
   req.checkBody('car_brand', 'Car brand is required').notEmpty();
   req.checkBody('car_model', 'Car model is required').notEmpty();
   req.checkBody('car_color', 'Car color is required').notEmpty();
   req.checkBody('category', 'Car category is required').notEmpty();
   req.checkBody('licence', 'Car licence is required').notEmpty();
   req.checkBody('type_of_parking', 'Parking type is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   var carsql = "INSERT INTO pt_vehicles(user_id,car_brand,car_model,color,category,licence,type_of_parking,created_on,created_by) VALUES ('"+req.body.uid+"','"+req.body.car_brand+"','"+req.body.car_model+"','"+req.body.car_color+"','"+req.body.category+"','"+req.body.licence+"','"+req.body.type_of_parking+"','"+c_date+"','"+req.body.uid+"')";
									      var query = connection.query(carsql,function(car_err,car_result){ 
											  if(car_err){
												      var ret_result={ status:2,message:car_err };
									                  return res.send(ret_result);
												   }else{
												   var ret_result={ status:1,message:'Car added successfully.'};
									                  return res.send(ret_result);
												    }
											  
											  
											   });
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
 //************************************************************** Add car End****************************************************************************//
 
 //************************************************************** My cars****************************************************************************//
 exports.my_cars = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'user id is required').notEmpty();
   
    if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
				var mycarsql ="SELECT * FROM pt_vehicles WHERE user_id='"+req.body.uid+"' AND status='active'";
				var query = connection.query(mycarsql,function(car_err,rows){ 
				  if(car_err){
						  var ret_result={ status:2,message:car_err };
						  return res.send(ret_result);
					   }else{
					   var ret_result={ status:1,message:'Success',data:rows};
						  return res.send(ret_result);
						}
				  
				  
				   });
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
 }; 
 //************************************************************** My cars End****************************************************************************//

   //************************************************************** Get primary car detail **************************************************//
 exports.get_primary_car = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'user id is required').notEmpty();
   req.checkBody('car_id', 'Car id is required').notEmpty();
   
    if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
				var mycarsql ="SELECT * FROM pt_vehicles WHERE user_id='"+req.body.uid+"' AND id='"+req.body.car_id+"' AND status='active'";
				var query = connection.query(mycarsql,function(car_err,rows){ 
				  if(car_err){
						  var ret_result={ status:2,message:car_err };
						  return res.send(ret_result);
					   }else{
					   var ret_result={ status:1,message:'Success',data:rows[0]};
						  return res.send(ret_result);
						}
				  
				  
				   });
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
 }; 
 //************************************************************** Get primary car detail End ***********************************************************//
  
 //*********************************************************** Get all parking type ****************************************************//
 exports.get_all_parking_type = function(req, res){
	 
   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);

    if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
    }else{
	   req.getConnection(function (err, connection){
		   if(req.body.uid==undefined){
			   var userid='';
			   }else{
				  userid=req.body.uid;
				   }
		    var acces_token_data = {
		    uid:userid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
				var parking_type_sql ="SELECT * FROM pt_parking_type WHERE status='active'";
				var query = connection.query(parking_type_sql,function(car_err,rows){ 
				  if(car_err){
						  var ret_result={ status:2,message:car_err };
						  return res.send(ret_result);
					   }else{
					   var ret_result={ status:1,message:'Success',data:rows};
						  return res.send(ret_result);
						}
				  
				  
				   });
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
 }; 
 //************************************************************** Get parking type end *************************************************//
 //*********************************************************** Change Password ****************************************************//
 exports.change_password = function(req, res){
   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'User id is required').notEmpty();
   req.checkBody('oldpassword', 'Old password is required').notEmpty();
   req.checkBody('newpassword', 'New password is required').notEmpty();
   req.checkBody('confirmpassword', 'Confirm password is required').notEmpty();
    if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
    }else{
	   req.getConnection(function (err, connection){
		   if(req.body.uid==undefined){
			   var userid='';
			   }else{
				  userid=req.body.uid;
				   }
		    var acces_token_data = {
		    uid:userid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   if(req.body.newpassword===req.body.confirmpassword){
				var check_old_pass ="SELECT password,status FROM pt_users WHERE id='"+req.body.uid+"'";
				var query = connection.query(check_old_pass,function(car_err,rows){ 
				   if(car_err){
						  var ret_result={ status:2,message:car_err };
						  return res.send(ret_result);
					   }else{
						 var oldpass=common.encrypt(req.body.oldpassword);
						 if(rows[0].status=='active'){
							  if(rows[0].password===oldpass){
								 
								   var newpass=common.encrypt(req.body.newpassword);
								
								   var check_old_pass ="UPDATE pt_users SET password='"+newpass+"' WHERE id='"+req.body.uid+"'";
								   var query = connection.query(check_old_pass,function(car_err,rows){ 
								  if(car_err){
										var ret_result={ status:2,message:car_err };
									  return res.send(ret_result);
								  }else{
					
								var ret_result={ status:1,message:'Password successfully updated.'};
								return res.send(ret_result);
								 }
							  }); 
							 } else{
									var ret_result={ status:2,message:'Old password does not match'};
								   return res.send(ret_result);
								}
							  
							}
					  else{
							var ret_result={ status:2,message:'Your status is blocked please contact admin'};
								   return res.send(ret_result);
							}	
				     }
				   });
			   }else{
				   
				   var ret_result={ status:2,message:"New password or confirm password does not match."};
				   return res.send(ret_result);
				   
				   }
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
 }; 
 //************************************************************** Change password end *************************************************//
 
 //************************************************************** Edit car start****************************************************************************//
 exports.edit_cars = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'user id is required').notEmpty();
   req.checkBody('car_id', 'Car id is required').notEmpty();
   
    if(req.body.type!='get'){
   req.checkBody('car_brand', 'Car brand is required').notEmpty();
   req.checkBody('car_model', 'Car model is required').notEmpty();
   req.checkBody('car_color', 'Car color is required').notEmpty();
   req.checkBody('category', 'Car category is required').notEmpty();
   req.checkBody('licence', 'Car licence is required').notEmpty();
   req.checkBody('type', 'Type is required').notEmpty();
   req.checkBody('type_of_parking', 'Parking type is required').notEmpty();
     }
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   if(req.body.type=='get'){
				   var mycarsql ="SELECT * FROM pt_vehicles WHERE user_id='"+req.body.uid+"' AND id='"+req.body.car_id+"'";
				var query = connection.query(mycarsql,function(car_err,rows){ 
				  if(car_err){
						  var ret_result={ status:2,message:car_err };
						  return res.send(ret_result);
					   }else{
					   var ret_result={ status:1,message:'Success',data:rows[0]};
						  return res.send(ret_result);
						}
				  
				  
				   }); 
				}
			   else{
			   var carUpdatesql = "UPDATE pt_vehicles SET car_brand='"+req.body.car_brand+"',car_model='"+req.body.car_model+"',color='"+req.body.car_color+"',category='"+req.body.category+"',licence='"+req.body.licence+"',type_of_parking='"+req.body.type_of_parking+"',updated_on='"+c_date+"',updated_by='"+req.body.uid+"' WHERE id='"+req.body.car_id+"'";
					  var query = connection.query(carUpdatesql,function(car_err,car_result){ 
						  if(car_err){
								  var ret_result={ status:2,message:car_err };
								  return res.send(ret_result);
							   }else{
							   var ret_result={ status:1,message:'Car Updated successfully.'};
								  return res.send(ret_result);
								}
						  
						  
						   });
					 }
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
 //************************************************************** Edit car End****************************************************************************//
  

 //**************************************************************Share and Recieve start*************************************************************//
 exports.share_and_recieve_parking = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'user id is required').notEmpty();
   req.checkBody('car_id', 'Car id is required').notEmpty();
   req.checkBody('type', 'type is required').notEmpty();
   req.checkBody('price', 'price is required').notEmpty();
   req.checkBody('date_time', 'date and time is required').notEmpty();
   req.checkBody('latitude', 'latitude is required').notEmpty();
   req.checkBody('longitude', 'longitude is required').notEmpty();
   req.checkBody('distance', 'distance is required').notEmpty();
   req.checkBody('size', 'size is required').notEmpty();
   req.checkBody('parking_type', 'parking type is required').notEmpty();
    
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   
			   if(req.body.parking_id==''){
				   var query_insert="INSERT INTO pt_parking(user_id,car_id,type,price,date_time,address,latitude,longitude,distance,size,parking_type,created_on,created_by) VALUES('"+req.body.uid+"','"+req.body.car_id+"','"+req.body.type+"','"+req.body.price+"','"+req.body.date_time+"','"+req.body.address+"','"+req.body.latitude+"','"+req.body.longitude+"','"+req.body.distance+"','"+req.body.size+"','"+req.body.parking_type+"','"+c_date+"','"+req.body.uid+"')";
				   var query = connection.query(query_insert,function(err,result){
					   if(err){
						    var ret_result={ status:2,message:err };
							 return res.send(ret_result);
						   }else{
							   var distance1=req.body.distance;
							 if(req.body.type=='receive'){
								   
								   var ptype=req.body.parking_type;
								   var parkinTyps=ptype.split(',');
								   
								   var search_maxtime=req.body.date_time;
								   var search_mintime=req.body.date_time;
								   var parkingTime = new Date(req.body.date_time).getTime();
								   var current_time=d.getTime();
								       var distance = parkingTime - current_time;
                                       var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                       var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                     if(hours>=1){
                                            var seconds=3600;
										    var parsedDate = new Date(Date.parse(search_mintime));
                                            var search_mintime = date.format(new Date(parsedDate.getTime()-(1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
									  }else{
									
										 var sec=minutes*60;
										 var minsecond=sec+seconds;
										 var parsedDate = new Date(Date.parse(search_mintime));
                                         var search_mintime = date.format(new Date(parsedDate.getTime() - (1000 * minsecond)),'YYYY-MM-DD HH:mm:ss');	
                                          
									  }
                                     //console.log(search_mintime+"=="+search_maxtime);
									 var select_query="SELECT `pt_parking`.*, `pt_parking`.`id` as `pid`,`pt_users`.`id` as `user_id`, `pt_users`.`first_name`, `pt_users`.`last_name`,`pt_users`.`fb_token`, `pt_vehicles`.`car_brand`,`pt_vehicles`.`car_model`,`pt_vehicles`.`image`,`pt_vehicles`.`color`,`pt_vehicles`.`licence`,( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`)) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.longitude+")) + sin(radians("+req.body.latitude+")) * sin( radians(`pt_parking`.`latitude`)))) AS distance  FROM `pt_parking` LEFT JOIN `pt_users` ON `pt_parking`.`user_id`=`pt_users`.`id` LEFT JOIN `pt_vehicles` ON `pt_parking`.`car_id`=`pt_vehicles`.`id` WHERE `pt_parking`.`status` = 'active' AND `pt_parking`.`type`='share' AND `pt_users`.`status` = 'active' AND `pt_parking`.`price`<= "+req.body.price+" AND `pt_parking`.`date_time`<= '"+search_maxtime+"' AND `pt_parking`.`date_time`>= '"+search_mintime+"' AND `pt_parking`.`user_id`!= "+req.body.uid+" AND `pt_parking`.`size`>= '"+req.body.size+"' AND `pt_parking`.`parking_type` IN ("+parkinTyps+") AND ( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`) ) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.longitude+")) + sin(radians("+req.body.latitude+")) * sin( radians(`pt_parking`.`latitude`)))) < "+distance1+" ORDER BY distance asc,pt_parking.date_time desc LIMIT 1";
									 
									 var query1 = connection.query(select_query,function(err,match_results){
										 if(err){
											     var ret_result={status:2,message:err,data:{parking_id:result.insertId} };
												 return res.send(ret_result);
											   }
											 else{
												 if(match_results.length>=1){
													  match_results[0].parking_id=result.insertId;
													 //************* send push notification to provider **********//
													  var sender_data={
														    reciver_id : req.body.uid,
														    user_id    : match_results[0].user_id,
														    reciver_parking_id : result.insertId,
														    parking_id : match_results[0].pid,
														    image      : req.body.image,
														    car_brand  : req.body.car_brand,
														    car_model  : req.body.car_model,
														    price      : req.body.price,
														    color      : req.body.color,
														    licence    : req.body.licence,
														    first_name : req.body.first_name,
														    last_name  : req.body.last_name,
														    type       : 'share'
														  }
													sendPushNotification(sender_data,match_results[0].fb_token);
													//************* send push notification to provider end**********//
													
				                                    //************* send push notification to reciver **********//									
													  var reciver_data={
														    user_id    : req.body.uid,
														    provider_id: match_results[0].user_id,
														    parking_id : result.insertId,
														    provider_parking_id : match_results[0].pid,
														    image      : match_results[0].image,
														    car_brand  : match_results[0].car_brand,
														    car_model  : match_results[0].car_model,
														    price      : req.body.price,
														    color      : match_results[0].color,
														    licence    : match_results[0].licence,
														    first_name : match_results[0].first_name,
														    last_name  : match_results[0].last_name,
														    type       : 'receive'
														  }
													  sendPushNotification(sender_data,req.body.fb_token);
													  
													  //************* send push notification to provider **********//									
														  
													  var ret_result={ status:1,message:'success',data:match_results[0] };
													  return res.send(ret_result);
													 } else{
													
													var ret_result={ status:0,message:'Waiting for a reciever',data:{} };
														return res.send(ret_result); 
													 }
												 
												 }
									 
										 });
									 
								 }
								else{
									   var ret_result={ status:1,message:'Waiting for a reciever',data:{parking_id:result.insertId} };
									   return res.send(ret_result); 
									   //~ var search_maxtime=req.body.date_time;
									   //~ var search_mintime=req.body.date_time;
									   //~ var parkingTime = new Date(req.body.date_time).getTime();
									   //~ var current_time=d.getTime();
								       //~ var distance = parkingTime - current_time;
                                       //~ var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                       //~ var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                       //~ var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                     //~ if(hours>=1){
                                            //~ var seconds=3600;
										    //~ var parsedDate = new Date(Date.parse(search_maxtime));
                                            //~ var search_maxtime = date.format(new Date(parsedDate.getTime() + (1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
                                            //~ //var seconds=3600;
										    //~ var parsedDate = new Date(Date.parse(search_mintime));
                                            //~ var search_mintime = date.format(new Date(parsedDate.getTime()-(1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
									  //~ }else{
											 //~ var seconds=3600;
											 //~ var parsedDate = new Date(Date.parse(search_maxtime));
											 //~ var search_maxtime = date.format(new Date(parsedDate.getTime() + (1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
												 
											 //~ var sec=minutes*60;
											 //~ var minsecond=sec+seconds;
											 //~ var parsedDate = new Date(Date.parse(search_mintime));
											 //~ var search_mintime = date.format(new Date(parsedDate.getTime() - (1000 * minsecond)),'YYYY-MM-DD HH:mm:ss');	
                                          
									  //~ }
                                     //~ //console.log(search_mintime+"=="+search_maxtime);
									 //~ var select_query="SELECT `pt_parking`.*, `pt_parking`.`id` as `pid`, `pt_users`.`first_name`, `pt_users`.`last_name`, `pt_vehicles`.`car_brand`,`pt_vehicles`.`car_model`,( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`)) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.longitude+")) + sin(radians("+req.body.latitude+")) * sin( radians(`pt_parking`.`latitude`)))) AS distance  FROM `pt_parking` LEFT JOIN `pt_users` ON `pt_parking`.`user_id`=`pt_users`.`id` LEFT JOIN `pt_vehicles` ON `pt_parking`.`car_id`=`pt_vehicles`.`id` WHERE `pt_parking`.`status` = 'active' AND `pt_parking`.`type`='receive' AND `pt_users`.`status` = 'active' AND `pt_parking`.`price`<= "+req.body.price+" AND `pt_parking`.`date_time`<= '"+search_maxtime+"' AND `pt_parking`.`date_time`>= '"+search_mintime+"' AND `pt_parking`.`size`<= '"+req.body.size+"' AND `pt_parking`.`parking_type`= '"+req.body.parking_type+"' AND ( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`) ) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.latitude+")) + sin(radians("+req.body.longitude+")) * sin( radians(`pt_parking`.`latitude`)))) < "+distance+" ORDER BY  LIMIT 1";
									 
									 //~ var query1 = connection.query(select_query,function(err,match_results){
										 //~ if(err){
											     //~ var ret_result={status:2,message:err,data:{parking_id:result.insertId} };
												 //~ return res.send(ret_result);
											   //~ }
											 //~ else{
												 //~ if(match_results.length>=1){
													 //~ match_results[0].parking_id=result.insertId;
													  //~ var ret_result={ status:1,message:'success',data:match_results[0] };
													  //~ return res.send(ret_result);
													 //~ } else{
													
													//~ var ret_result={ status:0,message:'no match found',data:{parking_id:result.insertId} };
														//~ return res.send(ret_result); 
													 //~ }
												 
												 //~ }
									 
										 //~ });
									 
								  }
							   
							   } 
					   
				   });
				   
				   
				}
			   else{
				       if(req.body.type=='receive'){
						        var ptype=req.body.parking_type;
								   var parkinTyps=ptype.split(',');
						   
					               var distance1=req.body.distance;
								   var search_maxtime=req.body.date_time;
								   var search_mintime=req.body.date_time;
								   var parkingTime = new Date(req.body.date_time).getTime();
								   var current_time=d.getTime();
								       var distance = parkingTime - current_time;
                                       var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                       var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                     if(hours>=1){
                                            //var seconds=3600;
										    //var parsedDate = new Date(Date.parse(search_maxtime));
                                            //var search_maxtime = date.format(new Date(parsedDate.getTime() + (1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
                                            //var seconds=3600;
										    var parsedDate = new Date(Date.parse(search_mintime));
                                            var search_mintime = date.format(new Date(parsedDate.getTime()-(1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
									  }else{
										// var seconds=3600;
										// var parsedDate = new Date(Date.parse(search_maxtime));
                                         //var search_maxtime = date.format(new Date(parsedDate.getTime() + (1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
                                         	 
										 var sec=minutes*60;
										 var minsecond=sec+seconds;
										 var parsedDate = new Date(Date.parse(search_mintime));
                                         var search_mintime = date.format(new Date(parsedDate.getTime() - (1000 * minsecond)),'YYYY-MM-DD HH:mm:ss');	
                                          
									  }
                                     //console.log(search_mintime+"=="+search_maxtime);
                                     
									var select_query="SELECT `pt_parking`.*, `pt_parking`.`id` as `pid`,`pt_users`.`id` as `user_id`, `pt_users`.`first_name`, `pt_users`.`last_name`,`pt_users`.`fb_token`, `pt_vehicles`.`car_brand`,`pt_vehicles`.`car_model`,`pt_vehicles`.`image`,`pt_vehicles`.`color`,`pt_vehicles`.`licence`,( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`)) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.longitude+")) + sin(radians("+req.body.latitude+")) * sin( radians(`pt_parking`.`latitude`)))) AS distance  FROM `pt_parking` LEFT JOIN `pt_users` ON `pt_parking`.`user_id`=`pt_users`.`id` LEFT JOIN `pt_vehicles` ON `pt_parking`.`car_id`=`pt_vehicles`.`id` WHERE `pt_parking`.`status` = 'active' AND `pt_parking`.`type`='share' AND `pt_users`.`status` = 'active' AND `pt_parking`.`price`<= "+req.body.price+" AND `pt_parking`.`date_time`<= '"+search_maxtime+"' AND `pt_parking`.`date_time`>= '"+search_mintime+"' AND `pt_parking`.`user_id`!= "+req.body.uid+" AND `pt_parking`.`size`>= '"+req.body.size+"' AND `pt_parking`.`parking_type` IN ("+parkinTyps+") AND ( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`) ) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.longitude+")) + sin(radians("+req.body.latitude+")) * sin( radians(`pt_parking`.`latitude`)))) < "+distance1+" ORDER BY distance asc,pt_parking.date_time desc LIMIT 1";
									
									// console.log(select_query);
									 var query1 = connection.query(select_query,function(err,match_results){
										 if(err){
											     var ret_result={status:2,message:err,data:{parking_id:result.insertId} };
												 return res.send(ret_result);
											   }
											 else{
												 if(match_results.length>=1){
													 match_results[0].parking_id=result.insertId;
													 
													  //************* send push notification to provider **********//
													  var sender_data={
														    reciver_id : req.body.uid,
														    user_id    : match_results[0].user_id,
														    reciver_parking_id : req.body.parking_id,
														    parking_id : match_results[0].pid,
														    image      : req.body.image,
														    car_brand  : req.body.car_brand,
														    car_model  : req.body.car_model,
														    price      : req.body.price,
														    color      : req.body.color,
														    licence    : req.body.licence,
														    first_name : req.body.first_name,
														    last_name  : req.body.last_name,
														    type       : 'share'
														  }
													sendPushNotification(sender_data,match_results[0].fb_token);
													//************* send push notification to provider end**********//
													
				                                    //************* send push notification to reciver **********//									
													  var reciver_data={
														    user_id    : req.body.uid,
														    provider_id: match_results[0].user_id,
														    parking_id : req.body.parking_id,
														    provider_parking_id : match_results[0].pid,
														    image      : match_results[0].image,
														    car_brand  : match_results[0].car_brand,
														    car_model  : match_results[0].car_model,
														    price      : req.body.price,
														    color      : match_results[0].color,
														    licence    : match_results[0].licence,
														    first_name : match_results[0].first_name,
														    last_name  : match_results[0].last_name,
														    type       : 'receive'
														  }
													  sendPushNotification(sender_data,req.body.fb_token);
													  
													  //************* send push notification to reciver end **********//
													  
													  
													  //******************** update status macheched**********************//
													  
													    var update_status="UPDATE pt_parking SET status='matched',updated_on='"+c_date+"',updated_by='"+req.body.uid+"'";
									                   var query1up =connection.query(update_status,function(err,res){ });
													  
													  
													  //******************** Insert into relation table*****************//
													   var insert_query="INSERT INTO pt_parking_matched_relation(share_id,reciev_id,provider_id,reciever_id,status,created_on) VALUES('"+match_results[0].pid+"','"+req.body.parking_id+"','"+match_results[0].user_id+"','"+req.body.uid+"','active','"+c_date+"','"+req.body.uid+"')";
									                   var query1 = connection.query(insert_query,function(err,res){ });
													 
													 
													  var ret_result={ status:1,message:'success',data:match_results[0] };
													  return res.send(ret_result);
													 } else{
													
													var ret_result={ status:0,message:'no match found',data:{parking_id:result.insertId} };
														return res.send(ret_result); 
													 }
												 
												 }
									 
										 });
									 
						 }
						 //~ else{
							   //~ var search_maxtime=req.body.date_time;
							   //~ var search_mintime=req.body.date_time;
							   //~ var parkingTime = new Date(req.body.date_time).getTime();
							   //~ var current_time=d.getTime();
							   //~ var distance = parkingTime - current_time;
							   //~ var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
							   //~ var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
							   //~ var seconds = Math.floor((distance % (1000 * 60)) / 1000);
							 //~ if(hours>=1){
									//~ var seconds=3600;
									//~ var parsedDate = new Date(Date.parse(search_maxtime));
									//~ var search_maxtime = date.format(new Date(parsedDate.getTime() + (1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
									//~ //var seconds=3600;
									//~ var parsedDate = new Date(Date.parse(search_mintime));
									//~ var search_mintime = date.format(new Date(parsedDate.getTime()-(1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
							  //~ }else{
									 //~ var seconds=3600;
									 //~ var parsedDate = new Date(Date.parse(search_maxtime));
									 //~ var search_maxtime = date.format(new Date(parsedDate.getTime() + (1000 * seconds)),'YYYY-MM-DD HH:mm:ss');
										 
									 //~ var sec=minutes*60;
									 //~ var minsecond=sec+seconds;
									 //~ var parsedDate = new Date(Date.parse(search_mintime));
									 //~ var search_mintime = date.format(new Date(parsedDate.getTime() - (1000 * minsecond)),'YYYY-MM-DD HH:mm:ss');	
								  
							  //~ }
							 //~ //console.log(search_mintime+"=="+search_maxtime);
							 //~ var select_query="SELECT `pt_parking`.*, `pt_parking`.`id` as `pid`, `pt_users`.`first_name`, `pt_users`.`last_name`, `pt_vehicles`.`car_brand`,`pt_vehicles`.`car_model`,( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`)) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.longitude+")) + sin(radians("+req.body.latitude+")) * sin( radians(`pt_parking`.`latitude`)))) AS distance  FROM `pt_parking` LEFT JOIN `pt_users` ON `pt_parking`.`user_id`=`pt_users`.`id` LEFT JOIN `pt_vehicles` ON `pt_parking`.`car_id`=`pt_vehicles`.`id` WHERE `pt_parking`.`status` = 'active' AND `pt_parking`.`type`='receive' AND `pt_users`.`status` = 'active' AND `pt_parking`.`price`<= "+req.body.price+" AND `pt_parking`.`date_time`<= '"+search_maxtime+"' AND `pt_parking`.`date_time`>= '"+search_mintime+"' AND `pt_parking`.`size`<= '"+req.body.size+"' AND `pt_parking`.`parking_type`= '"+req.body.parking_type+"' AND ( '6371' * acos( cos( radians("+req.body.latitude+") ) * cos( radians(`pt_parking`.`latitude`) ) * cos( radians(`pt_parking`.`longitude`) - radians("+req.body.latitude+")) + sin(radians("+req.body.longitude+")) * sin( radians(`pt_parking`.`latitude`)))) < "+distance+" ORDER BY  LIMIT 1";
							 
							 //~ var query1 = connection.query(select_query,function(err,match_results){
								 //~ if(err){
										 //~ var ret_result={status:2,message:err,data:{} };
										 //~ return res.send(ret_result);
									   //~ }
									 //~ else{
										 //~ if(match_results.length>=1){
											//~ // match_results[0].parking_id=result.insertId;
											  //~ var ret_result={ status:1,message:'success',data:match_results[0] };
											  //~ return res.send(ret_result);
											 //~ } else{
											
											//~ var ret_result={ status:0,message:'no match found',data:{} };
												//~ return res.send(ret_result); 
											 //~ }
										 
										 //~ }
							 
								 //~ });					   
					   
					      //~ }
			  
					 }
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
 //************************************************************** Share and Recieve End***************************************************************//
  

 //************************************************************** Confirm or declined from reciver **************************************************//
 
 exports.confirm_or_declined_by_reciever = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'User is required').notEmpty();
   req.checkBody('provider_id', 'Provider id is required').notEmpty();
   req.checkBody('booking_id', 'Booking id is required').notEmpty();
   req.checkBody('provider_booking_id', 'Provide booking id is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:'',
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
			   var select_query="SELECT status FROM pt_parking_matched_relation WHERE (status !='declined' OR status !='cancelled' OR status !='delete') AND share_id="+req.body.provider_booking_id+" AND reciev_id="+req.body.booking_id+"";
			    var query1 = connection.query(select_query,function(err,results){
			   if(err){
				        var ret_result={status:2,message:err,data:{} };
						return res.send(ret_result);
				   }
			   else{
				 if(results.length >=1){
				     
				     if(req.body.status=='declined'){
					     
					     var update_query="UPDATE pt_parking_matched_relation SET status='declined',canceled_by="+req.body.uid+",updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE share_id="+req.body.provider_booking_id+" AND reciev_id="+req.body.booking_id+"";
								  var query1 = connection.query(update_query,function(err,results1){
								   if(err){
										  var ret_result={status:2,message:err};
										  return res.send(ret_result);
									   }
								   else{
									     var update_parking="UPDATE pt_parking SET status='active',updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE id="+req.body.booking_id+" OR id="+req.body.provider_booking_id+"";
										  var ret_result={status:1,message:'success'};
										  return res.send(ret_result);
										  
										}
									  });
					   
					  }else{
						if(results[0].status=='active'){
								 var update_query="UPDATE pt_parking_matched_relation SET status='confirm_by_receiver',updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE share_id="+req.body.provider_booking_id+" AND reciev_id="+req.body.booking_id+"";
								  var query1 = connection.query(update_query,function(err,results1){
								   if(err){
											var ret_result={status:2,message:err};
											return res.send(ret_result);
									   }
								   else{
										  var ret_result={status:1,message:'success'};
											return res.send(ret_result);
										  
										}
									  });
						}else{
							var update_query="UPDATE pt_parking_matched_relation SET status='confirm',updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE share_id="+req.body.provider_booking_id+" AND reciev_id="+req.body.booking_id+"";
							  var query1 = connection.query(update_query,function(err,results1){
							   if(err){
										var ret_result={status:2,message:err};
										return res.send(ret_result);
								   }
							   else{
									  var ret_result={status:1,message:'success'};
										return res.send(ret_result);
									  
									}
								  });
							
							
							}
						}
					    
					  }else{
						  var ret_result={status:2,message:'There are some technical issue. Please try again'};
						  return res.send(ret_result);
						  
						  }
		            }
		         });
          
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
  //************************************************** Confirm or declined request from reciver end ******************************************************//


 //*************************************************** accept or declined request from reciver ******************************************************//
 
 exports.confirm_or_declined_by_provider = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'User is required').notEmpty();
   req.checkBody('reciever_id', 'Reciever id is required').notEmpty();
   req.checkBody('booking_id', 'Booking id is required').notEmpty();
   req.checkBody('reciever_booking_id', 'reciever booking id is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
						 
			   var select_query="SELECT status FROM pt_parking_matched_relation WHERE (status !='declined' OR status !='cancelled' OR status !='delete') AND share_id="+req.body.booking_id+" AND reciev_id="+req.body.reciever_booking_id+"";
			    var query1 = connection.query(select_query,function(err,results){
			   if(err){
				        var ret_result={status:2,message:err,data:{} };
						return res.send(ret_result);
				   }
			   else{
				 if(results.length >=1){
				     
				     if(req.body.status=='declined'){
					     
					     var update_query="UPDATE pt_parking_matched_relation SET status='declined',canceled_by="+req.body.uid+",updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE share_id="+req.body.booking_id+" AND reciev_id="+req.body.reciever_booking_id+"";
								  var query1 = connection.query(update_query,function(err,results1){
								   if(err){
										  var ret_result={status:2,message:err};
										  return res.send(ret_result);
									   }
								   else{
									     var update_parking="UPDATE pt_parking SET status='active',updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE id="+req.body.booking_id+" OR id="+req.body.reciever_booking_id+"";
										  var ret_result={status:1,message:'success'};
										  return res.send(ret_result);
										  
										}
									  });
					   
					  }else{
						if(results[0].status=='active'){
								 var update_query="UPDATE pt_parking_matched_relation SET status='confirm_by_receiver',updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE share_id="+req.body.booking_id+" AND reciev_id="+req.body.reciever_booking_id+"";
								  var query1 = connection.query(update_query,function(err,results1){
								   if(err){
											var ret_result={status:2,message:err};
											return res.send(ret_result);
									   }
								   else{
										  var ret_result={status:1,message:'success'};
											return res.send(ret_result);
										  
										}
									  });
						}else{
							var update_query="UPDATE pt_parking_matched_relation SET status='confirm',updated_by="+req.body.uid+",updated_on='"+c_date+"' WHERE share_id="+req.body.booking_id+" AND reciev_id="+req.body.reciever_booking_id+"";
							  var query1 = connection.query(update_query,function(err,results1){
							   if(err){
										var ret_result={status:2,message:err};
										return res.send(ret_result);
								   }
							   else{
									  var ret_result={status:1,message:'success'};
										return res.send(ret_result);
									  
									}
								  });
							
							
							}
						}
					    
					  }else{
						  var ret_result={status:2,message:'There are some technical issue. Please try again'};
						  return res.send(ret_result);
						  
						  }
		            }
		         });
          
			  
            }else{
			  return res.send({status:2,msg:'Invalid access token'});
			  }   

             });
	    });
    }
  
 }; 
  //********************************************** accept or declined request from reciver end ******************************************************//



 //************************************************************** add review  **********************************************************************//
 
 exports.add_reviews = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'User is required').notEmpty();
   req.checkBody('user_id', 'Reciever id is required').notEmpty();
   req.checkBody('booking_id', 'Booking id is required').notEmpty();
   //req.checkBody('review', 'Review is required').notEmpty();
   req.checkBody('rating', 'rating is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
                 var insert_query="INSERT INTO pt_reviews(user_id,booking_id,rating,created_on,created_by) VALUES('"+req.body.user_id+"','"+req.body.booking_id+"','"+req.body.rating+"','"+c_date+"','"+req.body.uid+"')";
						  var query1 = connection.query(insert_query,function(err,res){
							  if(err){
								   var ret_result={status:2,message:err,data:{} };
								   return res.send(ret_result);
								  }
							  else{
								 
								var ret_result={ status:1,message:'success',data:{} };
								return res.send(ret_result);	
							  }			 
						   });
						  
						}else{
						  return res.send({status:2,msg:'Invalid access token'});
						  }   

             });
	    });
    }
  
 }; 
  //************************************************************** add review end ****************************************************************//
  
 

//************************************************************** logout start **********************************************************************//
 
 exports.logout = function(req, res){
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

   req.checkBody('device_id', 'Device id is required').notEmpty();
   req.checkBody('device_type', 'Device type is required').notEmpty();
   req.checkBody('api_key', 'Api key is required').notEmpty();
   req.checkBody('access_token', 'Access token is required').notEmpty();
   req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
   req.checkBody('uid', 'User is required').notEmpty();
     if(req.validationErrors()){
	  //console.log(req.validationErrors());
      req.flash("msg",req.validationErrors());
           var messg=req.flash();
      var result={status:0,message:messg.msg};
      return res.send(result);
   }else{
	   req.getConnection(function (err, connection){
		    var acces_token_data = {
		    uid:req.body.uid,
		    access_token:req.body.access_token,
            device_id    : req.body.device_id,
            device_type    : req.body.device_type,
            api_key    : req.body.api_key
        };
        
       // var access_result={};
       checkAccessToken(acces_token_data,connection, function(result){
           if(result.status==1){
                 var delete_query="DELETE FROM pt_devices WHERE device_id='"+req.body.device_id+"' AND device_type='"+req.body.device_type+"' AND uid='"+req.body.uid+"'";
						  var query1 = connection.query(delete_query,function(err,res){
							  if(err){
								   var ret_result={status:2,message:err,data:{} };
								   return res.send(ret_result);
								  }
							  else{
								 
								var ret_result={ status:1,message:'success',data:{} };
								return res.send(ret_result);	
							  }			 
						   });
						  
						}else{
						  return res.send({status:2,msg:'Invalid access token'});
						  }   

             });
	    });
    }
  
 }; 
  //************************************************************** logout end ****************************************************************//
