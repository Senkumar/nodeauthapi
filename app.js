const express 	= require("express");
const jwt 		= require("jsonwebtoken");

var app = express();

app.get("/api", (request, response) => {
	response.json({
		message:"Welcome to the API!"
	});
});

app.post("/api/posts", includeToken, (request, response) => {
	jwt.verify(request.token, 'secretkey', (err, authData) => {
		if(err){
			response.sendStatus(403);
		}else{
			response.json({
				message:"Post received!",
				authData
			});
		}
	});
});

app.post("/api/login", (request, response) => {
	//Dummy user
	const user = {
		id : 1,
		name: "SenKumar"
	}
	
	jwt.sign({user}, 'secretkey', {expiresIn : '30s'},  (err, token) => {
		response.json({
			token
		});
	});	
});

//Include Token to request
function includeToken(request, response, next){
	const authHeader = request.headers['authorization'];
	if(typeof authHeader !== 'undefined'){
		const bearer 		= authHeader.split(' ');
		const bearerToken	= bearer[1];
		request.token 		= bearerToken;
		next();
	}else{
		response.sendStatus(403);//Forbidden
	}
}

app.listen(5000, () => { console.log("Server started on port 5000!"); });