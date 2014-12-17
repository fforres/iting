var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var users = require('./../../model/m_users.js');

// route middleware that will happen on every request
router.use(function(req, res, next) {
	next()
});



router.route('/')
	.get(function(req, res) {
		users.ShowUsersList(req, res);
	});


router.route('/all')
	.get(function(req, res) {
		users.ShowUsersList(req, res);
	});



router.route('/edit/:MongoId/asignaralocal')
	.get(function(req, res) {
		users.ShowEditUser_AsignarALocal(req, res,req.params.MongoId);
	})
	.post(function(req, res) {
		users.UpdateUser_AsignarALocal(req, res,req.params.MongoId);
	});

router.route('/edit/:MongoId/roles')
	.get(function(req, res) {
		users.ShowEditUser_Roles(req, res);
	})
	.post(function(req, res) {
		users.UpdateUser_Roles(req, res, req.params.MongoId);
	});



module.exports = router;