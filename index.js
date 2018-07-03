var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

var one = 1;
var two = 2;
io.on('connection', function(socket){
	if(one == 1){
		console.log('a user connected');
		one++;
	}

 socket.on('disconnect', function(){
	 if(two == 2){
		console.log('user disconnected');
		two++;
	 }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
