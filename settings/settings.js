

var Cookie = {
	secret : "ITING - COOKIE SECRET BY: FFORR.ES"
}

var Mongo = {
	Db: 'iting',
	Server: 'localhost',
	Host: 'ds051990.mongolab.com',
	Port: 51990,	
	User: 'iting',
	Pass: 'iting',
	SessionCollection: 'sessions'
}



exports.CookieSecret = Cookie.secret;
exports.Mongo = Mongo;
