// Variable Declaration
date = require('date-and-time');
var d = new Date();
var c_date = date.format(d, 'YYYY-MM-DD HH:mm:ss');
var base_url = 'http://localhost:4000/';
var common = require('./common');
// for local
//~ var base_url='http://ec2-18-216-103-110.us-east-2.compute.amazonaws.com/'; // for server
var fs = require('fs');

// Genrate Access Token ~~~~~ Open ~~~~~
exports.access_token = function (req, res) {

	//~ console.log(req.body);
	// key and validation of this API
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var data = {
				uid: '',
				access_token: '',
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(data, connection, function (result) {
				if (result)
					return res.send(result);
				else
					return res.send({status: 2, message: 'access token note generate'});
			});
		});
	}
};
// Genrate Access Token ~~~~~ Close ~~~~~


// Check Access Token Avilable Otherwise Create Access- Token ~~~~~ Open ~~~~~
function checkAccessToken(data, connection, callback) {
	//var result;
	if (data.access_token == '') {
		var query = connection.query('SELECT * FROM devices WHERE device_id="' + data.device_id + '" AND device_type="' + data.device_type + '" ', function (err, rows, result) {  //console.log

			if (rows.length >= 1) {
				var result = {
					status: 1,
					message: 'success',
					token: rows[0].access_token
				}
				callback(result);
			}
			else {
				var result;
				var d = new Date();
				var token = d.getTime() + "dating";
				var c_date = date.format(d, 'YYYY-MM-DD HH:mm:ss');

				var sql = "INSERT INTO devices (device_id, device_type,access_token,created_on,updated_on) VALUES ('" + data.device_id + "', '" + data.device_type + "','" + token + "','" + c_date + "','" + c_date + "')";

				var query = connection.query(sql, function (err, rows, result) {
					if (err) {
						var result = {
							status: 2,
							message: 'There are some technical issue.'
						}
						callback(result);
					} else {
						var result = {
							status: 1,
							message: 'success',
							token: token
						}
						callback(result);
					}
				});
			}
		});
	}
	else {
		var query = connection.query('SELECT * FROM devices WHERE device_id="' + data.device_id + '" AND device_type="' + data.device_type + '" AND access_token="' + data.access_token + '"', function (err, rows, result) {
			if (rows.length >= 1) {

				if (data.uid != '' && data.uid != rows[0].uid) {
					var d = new Date();
					var u_date = date.format(d, 'YYYY-MM-DD HH:mm:ss');
					var query = connection.query('UPDATE * devices SET uid="' + data.uid + '" ,updated_on="' + u_date + '"', function (err, results) {
						if (err) {
							var result = {
								status: 2,
								message: err
							}
							callback(result);
						}
						else {
							var result = {
								status: 1,
								message: 'success',
								token: rows[0].access_token,
								uid: rows[0].uid
							}
							callback(result);
						}
					});
				} else {
					var result = {
						status: 1,
						message: 'success',
						token: rows[0].access_token,
						uid: rows[0].uid
					}
					callback(result);
				}
			} else {
				var result = {
					status: 2,
					message: 'Access token expired'
				}
				callback(result);

			}
		});
	}
}

// Check Access Token Avilable Otherwise Create Access- Token ~~~~~ Close ~~~~~


// Get Language  ~~~~~~~~ Open ~~~~~~~~~
exports.get_language = function (req, res) {
	req.checkBody('api_key', 'Api key is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var selectqry = "SELECT id,page_name,tag_name,en,se FROM language ";

			var query = connection.query(selectqry, function (err, result) {
				if (err) {
					var ret_result = {status: 2, errors: err};
					return res.send(ret_result);
				}
				else {
					if (result.length >= 1) {
						var result = {status: 1, message: 'sucess', data: result};
						return res.send(result);
					}
					else {
						var result = {status: 1, message: 'sucess', data: ''};
						return res.send(result);
					}
				}
			});

		}); // conection
	} // main eles

}
// Get Language  ~~~~~~~~ Close ~~~~~~~~~

// Get page content  ~~~~~~~~ Open ~~~~~~~~~
exports.page_content = function (req, res) {
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('page', 'page name is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var selectqry = "SELECT id,page_name,en_title,se_title,en_description,se_description FROM pages WHERE page_name ='" + req.body.page + "'";

			var query = connection.query(selectqry, function (err, result) {
				if (err) {
					var ret_result = {status: 2, errors: err};
					return res.send(ret_result);
				}
				else {
					if (result.length >= 1) {
						var result = {status: 1, message: 'sucess', data: result};
						return res.send(result);
					}
					else {
						var result = {status: 1, message: 'sucess', data: ''};
						return res.send(result);
					}
				}
			});

		}); // conection
	} // main eles

}
// Get Language  ~~~~~~~~ Close ~~~~~~~~~

// Registration and Login user ~~~~~~~~ Open ~~~~~~~~~
exports.registartion = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('gender', 'Gender is required').notEmpty();
	req.checkBody('dob', 'DOB is required YYYY-MM-DD').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('latitude', 'latitude is required').notEmpty();
	req.checkBody('longitude', 'longitude is required').notEmpty();
	//~ req.checkBody('phone', 'phone is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: '',
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var email = '';
					var phone = '';
					var dob = '';
					var gender = '';
					var pass = common.encrypt(req.body.password);
					if (req.body.email) {
						email = req.body.email;
						var selectqry = "SELECT * FROM user WHERE email='" + req.body.email + "' OR username='" + req.body.username + "' ";
					}
					//~ else if(req.body.phone)
					//~ var selectqry="SELECT * FROM user WHERE phone='"+req.body.phone+"' ";
					if (req.body.phone)
						phone = req.body.phone;
					if (req.body.dob)
						dob = req.body.dob;
					if (req.body.gender)
						gender = req.body.gender;
					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length >= 1) {
								if (result[0].email == req.body.email) {
									var result = {status: 0, message: 'Email already registered.'};
									return res.send(result);
								}
								else if (result[0].username == req.body.username) {
									var result = {status: 0, message: 'Username already registred.'};
									return res.send(result);
								}

							}
							else {
								var insertsql = "INSERT INTO user(name,email,username,phone,gender,password,latitude,longitude,dob,created_on) VALUES ('" + req.body.name + "','" + email + "','" + req.body.username + "','" + phone + "','" + gender + "','" + pass + "','" + req.body.latitude + "','" + req.body.longitude + "','" + dob + "','" + c_date + "')";
								var query = connection.query(insertsql, function (err, results) {
									if (err) {
										var result = {status: 2, message: err};
										return res.send(result);
									}
									else {
										var update_accesstoken = "UPDATE devices SET uid='" + results.insertId + "',updated_on='" + c_date + "' WHERE device_id='" + req.body.device_id + "' AND device_type='" + req.body.device_type + "' AND access_token='" + req.body.access_token + "'";
										var query = connection.query(update_accesstoken, function (errrrr, access_update) {
										});

										var result = {
											status: 1,
											message: 'You are successfully registered.',
											data: {uid: results.insertId}
										};
										return res.send(result);
									}

								});
							}
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Registration and Login user ~~~~~~~~ Close ~~~~~~~~~


exports.login = function (req, res) {
	//var reswww=common.encrypt('narendra@123');
	//var reswwwd=common.decrypt(reswww);

	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	//req.checkBody('fb_token', 'Firebase token is required').notEmpty();
	if (req.validationErrors()) {
		var message = req.validationErrors();
		// var messg=req.flash();
		var result = {status: 0, message: message[0].msg};
		return res.send(result);
	} else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: '',
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			// var access_result={};
			checkAccessToken(acces_token_data, connection, function (result) {
				if (result.status == 1) {
					var pass = common.encrypt(req.body.password);
					var selectqry = "SELECT id,email,username,name,password,dob,gender,latitude,longitude,prof_pic,phone,status FROM user WHERE (email='" + req.body.email + "' OR username='" + req.body.username + "') AND status !='deleted'";
					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						} else {
							if (result.length >= 1) {
								var pass = common.encrypt(req.body.password);
								if (pass == result[0].password) {
									if (result[0].status == 'active') {
										//********* Access token update******************//
										var update_accesstoken = "UPDATE devices SET uid='" + result[0].id + "',updated_on='" + c_date + "' WHERE device_id='" + req.body.device_id + "' AND device_type='" + req.body.device_type + "' AND access_token='" + req.body.access_token + "'";
										var query = connection.query(update_accesstoken, function (err, result1) {
										});
										//*********************************************//
										delete result[0].password;
										var ret_result = {status: 1, message: 'success', data: result[0]};
										return res.send(ret_result);
									} else {
										var ret_result = {status: 2, message: 'Your status is inactive.', data: {}};
										return res.send(ret_result);
									}
								} else {
									var ret_result = {status: 2, message: 'password is incorrect.', data: {}};
									return res.send(ret_result);

								}

							} else {

								var ret_result = {status: 2, message: 'Username or password is incorrect.'};
								return res.send(ret_result);
							}
						}
					});
				} else {
					return res.send({status: 2, message: 'Invalid access token'});
				}

			});
		});
	}

};

// Get Myprofile  ~~~~~~~~ Open ~~~~~~~~~
exports.myprofile = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var selectqry = "SELECT * FROM user WHERE id='" + req.body.uid + "' ";

					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length >= 1) {
								var result = {status: 1, message: 'sucess', data: result[0]};
								return res.send(result);
							}
							else {
								var result = {status: 0, message: 'Not registred', data: req.body.uid};
								return res.send(result);
							}
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Get Myprofile  ~~~~~~~~ Close ~~~~~~~~~


// Pause My A/c ~~~~~~~~ Open ~~~~~~~~~
exports.pause_ac = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var update_sql = "UPDATE user SET ac_pause='1',updated_on='" + c_date + "' WHERE id='" + req.body.uid + "'";
					var query = connection.query(update_sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your account pause successfully'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Pause My A/c  ~~~~~~~~ Close ~~~~~~~~~

// Enable Discovery (Enable Pause My A/c) ~~~~~~~~ Open ~~~~~~~~~
exports.enable_discovery = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var update_sql = "UPDATE user SET ac_pause='0',updated_on='" + c_date + "' WHERE id='" + req.body.uid + "'";
					var query = connection.query(update_sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your account enable successfully'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Enable Discovery (Enable Pause My A/c)  ~~~~~~~~ Close ~~~~~~~~~


// Delete My A/c ~~~~~~~~ Open ~~~~~~~~~
exports.delete_ac = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('email', 'Email id is required').notEmpty();
	req.checkBody('reason', 'Delete reason is required').notEmpty();
	if (req.body.reason && req.body.reason == 'other')
		req.checkBody('del_disc', 'Delete discreption is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var d = new Date();
					var time = d.getTime();
					var email = time + '_' + req.body.email;

					var delete_disc = '';
					if (req.body.del_disc)
						delete_disc = req.body.del_disc;

					var update_sql = "UPDATE user SET email='" + email + "', ac_del_reason='" + req.body.reason + "',ac_del_other_disc='" + delete_disc + "',updated_on='" + c_date + "',status='deleted' WHERE id='" + req.body.uid + "' AND email='" + req.body.email + "'";

					var query = connection.query(update_sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your accout successfully deleted'};
							return res.send(result);
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Delete My A/c  ~~~~~~~~ Close ~~~~~~~~~

// My Setting  ~~~~~~~~ Open ~~~~~~~~~
exports.setting = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();

	req.checkBody('minage', 'Min Age is required').notEmpty();
	req.checkBody('maxage', 'Min Age is required').notEmpty();

	req.checkBody('formen', 'For men is required').notEmpty();
	req.checkBody('forwomen', 'For women is required').notEmpty();

	req.checkBody('lat', 'Latitude is required').notEmpty();
	req.checkBody('lng', 'Longitude is  required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();

	req.checkBody('gender', 'Gender is required').notEmpty();
	req.checkBody('dob', 'DOB is required YYYY-MM-DD').notEmpty();

	req.checkBody('movie', 'for movie is required').notEmpty();
	req.checkBody('dinner', 'for dinner is required').notEmpty();
	req.checkBody('other', 'for other is required').notEmpty();
	if (req.body.other && req.body.other == 1)
		req.checkBody('other_disc', 'Other description is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var other_disc = '';
					if (req.body.other_disc)
						other_disc = req.body.other_disc;

					var update_sql = "UPDATE user SET longitude='" + req.body.lng + "',latitude='" + req.body.lat + "',address='" + req.body.address + "',for_men='" + req.body.formen + "',for_women='" + req.body.forwomen + "',min_age='" + req.body.minage + "',max_age='" + req.body.maxage + "',dating_movie='" + req.body.movie + "',dating_dinner='" + req.body.dinner + "',dating_other='" + req.body.other + "',dating_other_disc='" + other_disc + "',dob='" + req.body.dob + "',gender='" + req.body.gender + "',updated_on='" + c_date + "' WHERE id='" + req.body.uid + "'";
					var query = connection.query(update_sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your setting updated successfully'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles
}
// My Setting  ~~~~~~~~ Close ~~~~~~~~~

// Edit/Update profile  ~~~~~~~~ Open ~~~~~~~~~
exports.update_prof = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();

	req.checkBody('about', 'About is required').notEmpty();
	//~ req.checkBody('name', 'Name is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var images = '';

					if (req.files) {
						if (req.files.car_images) {
							for (var i = 0; i < req.files.car_images.length; i++) {
								var tmp_path = req.files.car_images[i].path;
								var filename = req.files.car_images[i].name;
								var arr_filename = filename.split('.');
								var file_extebtion = arr_filename[arr_filename.length - 1];
								req.files.car_images[i].name = d.getTime() + i + '_prof.' + file_extebtion;
								images += req.files.car_images[i].name + ',';
								var target_path = maindir + '/uploads/profile_pic/' + req.files.car_images[i].name;
								fs.rename(tmp_path, target_path, function (err) {
									if (err) console.log(err);
									fs.unlink(tmp_path, function () {
										//if (err) console.log(err);
										console.log('File uploaded to: ' + i);
									});
								});
							}
						}
					} // file if check
					var update_sql = "UPDATE user SET about='" + req.body.about + "',prof_pic='" + images + "',updated_on='" + c_date + "' WHERE id='" + req.body.uid + "'";
					var query = connection.query(update_sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your profile updated successfully'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles
}
// Edit profile  ~~~~~~~~ Close ~~~~~~~~~


// Logout  ~~~~~~~~ Open ~~~~~~~~~
exports.logout = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "DELETE FROM devices WHERE device_id='" + req.body.device_id + "' AND device_type='" + req.body.device_type + "' AND uid='" + req.body.uid + "'";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your accout successfully deleted'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Logout  ~~~~~~~~ Close ~~~~~~~~~

// Report User  ~~~~~~~~ Open ~~~~~~~~~
exports.report_user = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // logged user
	req.checkBody('user_id', 'report for user id is required').notEmpty(); // report user for
	req.checkBody('reason', 'report reason is required').notEmpty();
	if (req.body.reason && req.body.reason == 'other')
		req.checkBody('reason_disc', 'report discreption is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var reason_disc = '';
					if (req.body.reason_disc)
						reason_disc = req.body.reason_disc;
					var insertsql = "INSERT INTO report_user(user_id,report_reason,reason_disc,created_by,created_on) VALUES ('" + user_id + "','" + req.body.reason + "','" + reason_disc + "','" + req.body.uid + "','" + c_date + "')";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'your accout successfully deleted'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Report User   ~~~~~~~~ Close ~~~~~~~~~

// Swipe User  ~~~~~~~~ Open ~~~~~~~~~
exports.swipe = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);

	req.checkBody('uid', 'Userid is required').notEmpty(); // logged user
	req.checkBody('user_id', 'report for user id is required').notEmpty(); // swipe for user
	req.checkBody('swp_in', 'swipe in(left,right) is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var swipe_in = 0;
					if (req.body.swp_in == 'right')
						swipe_in = 1;

					var sql1 = "SELECT id FROM swipe WHERE swiped_by='" + req.body.uid + "' AND user_id='" + req.body.user_id + "' AND status='active' ORDER BY id desc LIMIT 1";

					var query = connection.query(sql1, function (err, row, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							if (row.length >= 1) // true update else insert
								var sql = "UPDATE swipe SET swipe_in='" + swipe_in + "',updated_on='" + c_date + "',updated_by='" + c_date + "' WHERE swiped_by='" + req.body.uid + "' AND user_id='" + req.body.user_id + "'";
							else
								var sql = "INSERT INTO swipe(user_id,swipe_in,swiped_by,swiped_on) VALUES ('" + req.body.user_id + "','" + swipe_in + "','" + req.body.uid + "','" + c_date + "')";

							var query = connection.query(sql, function (err, result) {

								if (err) {
									var ret_result = {status: 0, errors: err};
									return res.send(ret_result);
								}
								else {
									var sql2 = "SELECT DISTINCT LEAST(t1.swiped_by, t1.user_id) AS Person1, GREATEST(t1.swiped_by, t1.user_id) AS Person2,t1.id FROM swipe t1 INNER JOIN swipe t2 ON t1.user_id = t2.swiped_by AND t1.swiped_by = t2.user_id WHERE t1.swipe_in = 1 AND t2.swipe_in = 1 AND ((t1.swiped_by = '" + req.body.user_id + "' and t1.user_id='" + req.body.uid + "') or (t1.swiped_by = '" + req.body.uid + "' and t1.user_id='" + req.body.user_id + "') ) AND t1.status='active'";
									var query = connection.query(sql2, function (err, result) {

										if (err) {
											var ret_result = {status: 0, errors: err};
											return res.send(ret_result);
										}
										else {
											if (result.length >= 2) {

												var sql3 = "SELECT id FROM matching WHERE time_out=0 AND datting_done=0 AND status='active' AND ((user_id='" + req.body.uid + "' AND partner_id='" + req.body.user_id + "') OR (user_id='" + req.body.user_id + "' AND partner_id='" + req.body.uid + "'))";
												var query = connection.query(sql3, function (err, result3) {

													if (err) {
														var ret_result = {status: 0, errors: err};
														return res.send(ret_result);
													}
													else {
														if (result3.length == 0) {
															var sql4 = "INSERT INTO matching(swipe_id1, swipe_id2, user_id, partner_id, created_on) VALUES ('" + result[0].id + "','" + result[1].id + "','" + req.body.uid + "','" + req.body.user_id + "','" + c_date + "')";

															var query = connection.query(sql4, function (err, result4) {

																if (err) {
																	var ret_result = {status: 0, errors: err};
																	return res.send(ret_result);
																}
																else {
																	var sql5 = "SELECT id,name,prof_pic FROM user WHERE id='" + req.body.user_id + "'";
																	var query = connection.query(sql5, function (err, result5) {

																		if (err) {
																			var ret_result = {status: 0, errors: err};
																			return res.send(ret_result);
																		}
																		else {
																			var result = {
																				status: 1,
																				message: 'successfully matched ' + req.body.swp_in,
																				match: 1,
																				match_id: result4.insertId,
																				match_user: result5[0]
																			};
																			return res.send(result);
																		}
																	});
																}

															});
														}
														else {
															var sql5 = "SELECT id,name,prof_pic FROM user WHERE id='" + req.body.user_id + "'";
															var query = connection.query(sql5, function (err, result5) {

																if (err) {
																	var ret_result = {status: 0, errors: err};
																	return res.send(ret_result);
																}
																else {
																	var result = {
																		status: 1,
																		message: 'successfully matched ' + req.body.swp_in,
																		match: 1,
																		match_id: result3[0].id,
																		match_user: result5[0]
																	};
																	return res.send(result);
																}
															});
														}
													}
												});
											}//
											else {
												var result = {
													status: 1,
													message: 'successfully swiped in ' + req.body.swp_in,
													match: 0
												};
												return res.send(result);
											}
										}
									});
									//~ var result={status:1,message:'successfully swiped in '+req.body.swp_in};
									//~ return res.send(result);
								}
							});
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Swiped User   ~~~~~~~~ Close ~~~~~~~~~

// User Search Listing ~~~~~~~~ Open ~~~~~~~~~
exports.searching = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // logged user

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql1 = "SELECT * FROM user WHERE id='" + req.body.uid + "' ";

					var query = connection.query(sql1, function (err, row, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							user = row[0];

							var sql2 = "SELECT swiped_by FROM swipe WHERE user_id='" + req.body.uid + "' AND status !='deleted'";
							var query = connection.query(sql2, function (err, result) {
								if (err) {
									var ret_result = {status: 0, errors: err};
									return res.send(ret_result);
								}
								else {
									var sql3 = "SELECT id,name,about,gender,dob,dating_movie,dating_dinner,dating_other,prof_pic,latitude,longitude FROM user WHERE status !='deleted' AND id !='" + req.body.uid + "'";
									var query = connection.query(sql3, function (err, result) {
										if (err) {
											var ret_result = {status: 0, errors: err};
											return res.send(ret_result);
										}
										else {
											var result = {status: 1, message: 'success', data: result};
											return res.send(result);
										}
									});
								}
							});
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  User Search Listing   ~~~~~~~~ Close ~~~~~~~~~

// another user view profile
// ~~~~~~~~ Open ~~~~~~~~~
exports.viewprofile = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // login user
	req.checkBody('user_id', 'another user id is required').notEmpty(); // another user


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var selectqry = "SELECT id,name,dob,gender,about,dating_movie,dating_dinner,dating_other,prof_pic,latitude,longitude,address FROM user WHERE id='" + req.body.user_id + "' ";

					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length >= 1) {
								var result = {status: 1, message: 'sucess', data: result[0]};
								return res.send(result);
							}
							else {
								var result = {status: 0, message: 'Not registred', data: req.body.uid};
								return res.send(result);
							}
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// View profile ~~~~~~~~ Close ~~~~~~~~~

// Get Question List ~~~~~~~~ Open ~~~~~~~~~
exports.question_list = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // login user
	req.checkBody('match_id', 'Match id is required').notEmpty(); //matching ID


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var selectqry = "SELECT * FROM matching WHERE status='active' AND id='" + req.body.match_id + "'";

					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						}
						else {
							var my_ans_status = 0;
							var patner_ans_status = 0;
							if (result[0].user_id == req.body.uid) {
								my_ans_status = result[0].user_ans_ques;
								patner_ans_status = result[0].partner_ans_ques;
							}
							else {
								my_ans_status = result[0].partner_ans_ques;
								patner_ans_status = result[0].user_ans_ques;
							}

							if (patner_ans_status == 1) {
								var sql2 = "SELECT GROUP_CONCAT(id) as qids FROM question_answer WHERE status='active' AND match_id='" + req.body.match_id + "'";

								var query = connection.query(sql2, function (err, result2) {
									if (err) {
										var ret_result = {status: 2, errors: err};
										return res.send(ret_result);
									}
									else {
										if (result2.length >= 1) {
											var sql3 = "SELECT id,se_question,en_question FROM dating_ques WHERE id IN (" + result2[0].qids + ")";

											var query = connection.query(sql3, function (err, result3) {
												if (err) {
													var ret_result = {status: 2, errors: err};
													return res.send(ret_result);
												}
												else {
													if (result3.length >= 1) {
														var result = {status: 1, message: 'sucess', data: result3};
														return res.send(result);
													}
													else {
														var result = {status: 1, message: 'Not listing', data: ''};
														return res.send(result);
													}

												}
											});
										}
										else {
											var result = {status: 1, message: 'Not listing', data: ''};
											return res.send(result);
										}
									}
								});
							}
							else {
								var selectqry2 = "SELECT id,se_question,en_question FROM dating_ques WHERE status='active' ORDER BY RAND() LIMIT 4";

								var query = connection.query(selectqry2, function (err, result2) {
									if (err) {
										var ret_result = {status: 2, errors: err};
										return res.send(ret_result);
									}
									else {
										if (result2.length >= 1) {
											var result = {status: 1, message: 'sucess', data: result2};
											return res.send(result);
										}
										else {
											var result = {status: 1, message: 'Not listing', data: ''};
											return res.send(result);
										}
									}
								});
							}
						}
					});


				}//
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Get Question List ~~~~~~~~ Close ~~~~~~~~~


// Swipe User  ~~~~~~~~ Open ~~~~~~~~~
exports.sendmsg = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // logged user

	req.checkBody('receiver_id', 'receiver id is required').notEmpty(); // swipe for user
	req.checkBody('msg', 'user msg is required').notEmpty();
	req.checkBody('match_id', 'match id is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "INSERT INTO chatting(match_id,message,sender,receiver,created_on) VALUES ('" + req.body.match_id + "','" + req.body.msg + "','" + req.body.uid + "','" + req.body.receiver_id + "','" + c_date + "')";

					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'msg successfully ', lastid: result.insertId};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Swiped User   ~~~~~~~~ Close ~~~~~~~~~


// Get chat specific  ~~~~~~~~ Open ~~~~~~~~~
exports.getchat = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // login user

	req.checkBody('receiver_id', 'receiver id is required').notEmpty();
	req.checkBody('match_id', 'match id is required').notEmpty();

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var selectqry = "SELECT id,user_id,partner_id, time_out,user_ans_ques,partner_ans_ques,datting_done FROM matching WHERE id= '" + req.body.match_id + "' AND datting_done = 0 AND status='active'";
					var ques_ans_status = '';

					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length > 0) {
								if (result[0].time_out == 0) {
									ques_ans_status = (result[0].user_id == req.body.uid) ? result[0].user_ans_ques : result[0].partner_ans_ques;

									if (ques_ans_status) {
										var selectqry2 = "SELECT id,created_on,message,sender,receiver FROM chatting WHERE match_id= '" + req.body.match_id + "' ORDER BY id asc";

										var query = connection.query(selectqry2, function (err, result2) {
											if (err) {
												var ret_result = {status: 2, errors: err};
												return res.send(ret_result);
											}
											else {
												if (result2.length >= 1) {
													var sql3 = "SELECT * FROM dating WHERE match_id= '" + req.body.match_id + "' AND (dating_status='' or dating_status='accept') AND status='active' ORDER BY id desc LIMIT 1";

													var query = connection.query(sql3, function (err, result3) {
														if (err) {
															var ret_result = {status: 2, errors: err};
															return res.send(ret_result);
														}
														else {
															var result = {
																status: 1,
																message: 'sucess',
																data: result2,
																dating_data: result3
															};
															return res.send(result);
														}
													});


												}
												else {
													var result = {status: 1, message: 'Not listing', data: ''};
													return res.send(result);
												}
											}
										});
									}
									else {
										var result = {
											status: 0,
											message: 'Your chat is not enable pleas answer question',
											data: '',
											qestion: 0,
											match_id: req.body.match_id
										};
										return res.send(result);
									}

								}
								else {
									var result = {status: 0, message: 'Sorry! Time out of this chat', data: ''};
									return res.send(result);
								}

							}
							else {
								var result = {status: 0, message: 'Sorry! This chat is closed', data: ''};
								return res.send(result);
							}
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Get Specific chat ~~~~~~~~ Close ~~~~~~~~~

// Get chat MY-chat listing  ~~~~~~~~ Open ~~~~~~~~~
exports.chat_list = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty(); // login user

	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					//~ var selectqry="SELECT * FROM matching WHERE (user_id= '"+req.body.uid+"' OR partner_id= '"+req.body.uid+"') AND time_out=0 AND datting_done = 0 AND status='active' ORDER BY id desc";
					var selectqry = "SELECT `matching`.*, `u1`.`name` AS `user1`, `u2`.`name` AS `user2`, `u1`.`prof_pic` AS `prof_pic1`, `u2`.`prof_pic` AS `prof_pic2` FROM `matching` LEFT JOIN `user` `u1` ON `matching`.`user_id`=`u1`.`id` LEFT JOIN `user` `u2` ON `matching`.`partner_id`=`u2`.`id` WHERE (`matching`.`user_id`= '" + req.body.uid + "' OR `matching`.`partner_id`= '" + req.body.uid + "') AND `matching`.`time_out`=0 AND `matching`.`datting_done` = 0 AND `matching`.`status`='active' ORDER BY id desc";

					var query = connection.query(selectqry, function (err, result) {
						if (err) {
							var ret_result = {status: 2, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length >= 1) {
								var result = {status: 1, message: 'sucess', data: result};
								return res.send(result);
							}
							else {
								var result = {status: 1, message: 'Not listing', data: ''};
								return res.send(result);
							}
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Get chat MY-chat listing ~~~~~~~~ Close ~~~~~~~~~

// Submit Questions Answer ~~~~~~~~ Open ~~~~~~~~~
exports.submit_answer = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('partner_id', 'Partner id is required').notEmpty();
	req.checkBody('match_id', 'Match id is required').notEmpty();
	req.checkBody('ques_ids', 'Questions ids are required').notEmpty();
	req.checkBody('answers', 'Answer are required').notEmpty();
	// res.send(req.body); return false;
	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {

					var sql = "SELECT id FROM question_answer WHERE status='active' AND match_id='" + req.body.match_id + "'";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var qes_array = req.body.ques_ids.split(",");
							var ans_array = req.body.answers.split(",");

							if (result.length >= 1) {   //res.send('if'+qes_array+''+ans_array); return false;
								for (var i = 0; i < result.length; i++) {
									var sql = "UPDATE question_answer SET answer_user2='" + ans_array[i] + "',updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE match_id='" + req.body.match_id + "' AND question_id='" + qes_array[i] + "'";
									var query = connection.query(sql, function (err, result) {
									});
								}

								select_matching = "SELECT * FROM matching WHERE time_out=0 AND datting_done = 0 AND status='active' AND id='" + req.body.match_id + "'";
								var query = connection.query(select_matching, function (err, res_match) {
									if (err) {
										var ret_result = {status: 0, errors: err};
										return res.send(ret_result);
									}
									else {
										if (res_match[0].user_id == req.body.uid) {
											var matching_update = "UPDATE matching SET user_ans_ques='1',updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.match_id + "'";
										}
										else {
											var matching_update = "UPDATE matching SET partner_ans_ques='1',updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.match_id + "'";
										}

										var query = connection.query(matching_update, function (err, result) {
											if (err) {
												var ret_result = {status: 0, errors: err};
												return res.send(ret_result);
											}
											else {
												var result = {
													status: 1,
													message: 'your answer submitted successfully & your chat is enabled'
												};
												return res.send(result);
											}
										});
									}
								});
							}
							else {
								//  res.send('else'+qes_array+''+ans_array); return false;
								for (var i = 0; i < qes_array.length; i++) {
									var sql = "INSERT INTO question_answer(match_id,user1_id,user2_id,question_id, answer_user1, created_by, created_on) VALUES ('" + req.body.match_id + "','" + req.body.uid + "','" + req.body.partner_id + "','" + qes_array[i] + "','" + ans_array[i] + "','" + req.body.uid + "','" + c_date + "')";
									//res.send(sql); return false;
									var query = connection.query(sql, function (err, result) {
									});
									if (i == (qes_array.length - 1)) {
										select_matching = "SELECT * FROM matching WHERE time_out=0 AND datting_done = 0 AND status='active' AND id='" + req.body.match_id + "'";
										var query = connection.query(select_matching, function (err, res_match) {
											if (err) {
												var ret_result = {status: 0, errors: err};
												return res.send(ret_result);
											}
											else {
												if (res_match[0].user_id == req.body.uid) {
													var matching_update = "UPDATE matching SET user_ans_ques='1',updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.match_id + "'";
												}
												else {
													var matching_update = "UPDATE matching SET partner_ans_ques='1',updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.match_id + "'";
												}
												var query = connection.query(matching_update, function (err, result) {
													if (err) {
														var ret_result = {status: 0, errors: err};
														return res.send(ret_result);
													}
													else {
														var result = {
															status: 1,
															message: 'your answer submitted successfully & your chat is enabled on your hand'
														};
														return res.send(result);
													}
												});
											}
										});
									}
								}//forloop


							}

						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Submit Questions Answer  ~~~~~~~~ Close ~~~~~~~~~


// Deside for Dating ~~~~~~~~ Open ~~~~~~~~~
exports.new_dating = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('patner_id', 'Patner id is required').notEmpty();
	req.checkBody('match_id', 'Match id is required').notEmpty();
	req.checkBody('date', 'Dating date id is required YYYY-MM-DD').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "INSERT INTO dating(match_id,user_id,pattner_id,dating_on,created_by,created_on) VALUES ('" + req.body.match_id + "','" + req.body.uid + "','" + req.body.patner_id + "','" + req.body.date + "','" + req.body.uid + "','" + c_date + "')";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'Your dating request send successfully to your patner'};
							return res.send(result);
						}
					});
				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Deside for Dating  (new dating)~~~~~~~~ Close ~~~~~~~~~

// Dating Accept~~~~~~~~ Open ~~~~~~~~~
exports.date_accept = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('dating_id', 'Dating id is required').notEmpty();
	//~ req.checkBody('action', 'Action is required accept or decline').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "UPDATE dating SET dating_status='accept',updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.dating_id + "'";
					//res.send(sql); return false;
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var result = {status: 1, message: 'Dating accepted successfully'};
							return res.send(result);
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
//  Deside for Dating  (new dating)~~~~~~~~ Close ~~~~~~~~~

// Dating Decline~~~~~~~~ Open ~~~~~~~~~
exports.date_decline = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('dating_id', 'Dating id is required').notEmpty();
	req.checkBody('match_id', 'Match id is required').notEmpty(); // Chat (matching-id)
	req.checkBody('decline_reson', 'Decline reason is required').notEmpty();
	//~ req.checkBody('action', 'Action is required accept or decline').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "UPDATE dating SET dating_status='decline', status='deleted', decline_reson='" + req.body.decline_reson + "', updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.dating_id + "' ";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {

							var sql2 = "UPDATE matching SET  status='deleted' WHERE id='" + req.body.match_id + "' ";
							var query = connection.query(sql2, function (err, result) {

								if (err) {
									var ret_result = {status: 0, errors: err};
									return res.send(ret_result);
								}
								else {
									var result = {status: 1, message: 'Dating decline successfully'};
									return res.send(result);
								}
							});

						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Decline dating ~~~~~~~~ Close ~~~~~~~~~

// Dating Cancel ~~~~~~~~ Open ~~~~~~~~~
exports.date_cancel = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('dating_id', 'Dating id is required').notEmpty();
	req.checkBody('match_id', 'Dating id is required').notEmpty();
	req.checkBody('cancel_reasion', 'Decline reason is required').notEmpty();
	//~ req.checkBody('action', 'Action is required accept or decline').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "UPDATE dating SET dating_status='decline', status='deleted', cancel_reasion='" + req.body.cancel_reasion + "', updated_by='" + req.body.uid + "',updated_on='" + c_date + "' WHERE id='" + req.body.dating_id + "'";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							var sql2 = "UPDATE matching SET  status='deleted' WHERE id='" + req.body.match_id + "' ";
							var query = connection.query(sql2, function (err, result) {

								if (err) {
									var ret_result = {status: 0, errors: err};
									return res.send(ret_result);
								}
								else {
									var result = {status: 1, message: 'Dating cancel successfully'};
									return res.send(result);
								}
							});
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Dating cancel  ~~~~~~~~ Close ~~~~~~~~~

// My Dating List ~~~~~~~~ Open ~~~~~~~~~
exports.my_dating_list = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	//~ req.checkBody('action', 'Action is required accept or decline').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					//~ var sql="SELECT * FROM dating WHERE status='active' AND ( user_id='"+req.body.uid+"' OR pattner_id='"+req.body.uid+"')";
					var sql = "SELECT `dating`.*, `u1`.`name` AS `user1`, `u2`.`name` AS `user2`, `u1`.`prof_pic` AS `prof_pic1`, `u2`.`prof_pic` AS `prof_pic2` FROM `dating` LEFT JOIN `user` `u1` ON `dating`.`user_id`=`u1`.`id` LEFT JOIN `user` `u2` ON `dating`.`pattner_id`=`u2`.`id` WHERE (`dating`.`user_id`= '" + req.body.uid + "' OR `dating`.`pattner_id`= '" + req.body.uid + "') AND `dating`.`status`='active' ORDER BY id desc";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length >= 1) {
								var result = {status: 1, message: 'sucess', data: result};
								return res.send(result);
							}
							else {
								var result = {status: 0, message: 'Not registred', data: ''};
								return res.send(result);
							}
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// My Dating List ~~~~~~~~ Close ~~~~~~~~~

// Dateing Specific ~~~~~~~~ Open ~~~~~~~~~
exports.dating_specific = function (req, res) {
	req.checkBody('device_id', 'Device id is required').notEmpty();
	req.checkBody('device_type', 'Device type is required').notEmpty();
	req.checkBody('api_key', 'Api key is required').notEmpty();
	req.checkBody('access_token', 'Access token is required').notEmpty();
	req.checkBody('api_key', 'Api key does not match').equals(API_KEY);
	req.checkBody('uid', 'Userid is required').notEmpty();
	req.checkBody('dating_id', 'Dating is required').notEmpty();


	if (req.validationErrors()) {
		req.flash("msg", req.validationErrors());
		var messg = req.flash();
		var result = {status: 0, message: messg.msg};
		return res.send(result);
	}
	else {
		req.getConnection(function (err, connection) {
			var acces_token_data = {
				uid: req.body.uid,
				access_token: req.body.access_token,
				device_id: req.body.device_id,
				device_type: req.body.device_type,
				api_key: req.body.api_key
			};

			checkAccessToken(acces_token_data, connection, function (result) //
			{
				if (result.status == 1) {
					var sql = "SELECT * FROM dating WHERE status='active' AND ( user1_id='" + req.body.uid + "' OR user2_id='" + req.body.uid + "') AND id='" + req.body.dating_id + "'";
					var query = connection.query(sql, function (err, result) {

						if (err) {
							var ret_result = {status: 0, errors: err};
							return res.send(ret_result);
						}
						else {
							if (result.length >= 1) {
								var result = {status: 1, message: 'sucess', data: result[0]};
								return res.send(result);
							}
							else {
								var result = {status: 0, message: 'Not registred', data: ''};
								return res.send(result);
							}
						}
					});

				}
				else
					return res.send({status: 2, msg: 'Invalid access token'});
			}); // check token
		}); // conection
	} // main eles

}
// Dateing Specific  ~~~~~~~~ Close ~~~~~~~~~


// Privacy and Security ~~~~~~~~ Open ~~~~~~~~~
exports.privacy = function (req, res) {
	return res.send({status: 1, msg: 'Privacy and Security'});
}
// Privacy and Security ~~~~~~~~ Close ~~~~~~~~~
