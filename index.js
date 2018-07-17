var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

/*app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});*/

var adjectives = ["red", "orange", "yellow", "green", "blue", "purple", "black", "pink", "brown", "raging", "ferocious", "awesome", "stinky", "camouflaged", "jumpy", "plastic", "sticky", "trapped", "metal", "furry", "sleeping", "snoring", "running", "walking", "crazy", "fighting", "flying", "gliding", "happy", "sad", "eating", "working", "typing", "climbing", "WORKING", "colorful", "typical", "common", "rare", "dirty", "clean", "proper", "rich", "poor", "loving", "wooden", "paper", "fake", "sneaky", "sly", "broken", "convicted", "young", "old", "aged", "firey", "burnt", "ancient", "unearthed", "discovered", "fluttering", "shivering", "lazy", "honest", "deceitful", "robotic", "burning", "smoking", "legendary", "contented", "talkative", "ridiculous", "colonial", "fabric", "fabricated", "squishy", "squished", "blank", "electronic", "pennyless", "broke", "burping", "lethargic", "shaking", "sick", "flowery", "frozen", "spinning", "fat", "rotating", "obese", "overweight", "worthless"];
var nouns = ["bear", "lion", "man", "car", "panda", "tiger", "cat", "dog", "hamster", "PROGRAMMER", "gamer", "employee", "employer", "thief", "theif", "firefighter", "wind", "boat", "sea", "gunner", "space", "air", "mouse", "kitten", "scab", "pizza", "ice-cream", "chocolate", "grapes", "horse", "government", "president", "leader", "convict", "ball", "treasure", "pearl", "gem", "chest", "box", "apple", "block", "snake", "bird", "ship", "tulip", "coupon", "pauper", "prince", "princess", "king", "queen", "peasant", "musician", "knight", "castle", "chimney", "chimneysweep", "servant", "advertisement", "mushroom", "manager", "dancer", "giraffe", "mermaid", "unicorn", "dragon", "book"];
var socketids = [];
var players = [];
var playernum = 0;
var rooms = [];
var roomnum = 0;
var playersonline = 0;
var roomlimit = 3;//The number of people allowed in each room

io.on('connection', function(socket){
	console.log('User ' + socket.id + ' connected.');

	new player(socket.id);
	socket.broadcast.emit('player', players[playernum]);

	io.to(socket.id).emit('youare', players[socketids.indexOf(socket.id)]);
	io.to(socket.id).emit('playersonline', playersonline);
	playernum++;
	playersonline++;

	socket.on('click', function(x, y){
		socket.broadcast.emit('click', x, y);
	});
	
	socket.on('ready', function(id){
		for(var p = 0; p < players.length; p++){
			if(players[p].id == id){
				if(rooms.length < 1){ //If there are no rooms
					socket.join('room'+roomnum);//
					players[p].room = roomnum;//
					rooms.push(1);//
					roomnum++;//
					console.log(rooms);
				}
				else{ //If there are rooms
					for(var r = 0; r < rooms.length; r++){
						if(rooms[r] < roomlimit){//If there are fewer than 3 people in this room, join it
							socket.join('room'+r);
							players[p].room = (r);
							rooms[r]++;
							console.log(rooms);
							r = rooms.length;//And end the loop so you don't join more than one room =P
						}
						else if(rooms[r] >= roomlimit){//If the number of people in this room is greater than or equal to 3
							if(r == rooms.length - 1){//And we've checked all the rooms for an opening
								socket.join('room'+roomnum);//Make a new room and join it
								players[p].room = roomnum;
								rooms.push(1);
								roomnum++;
								console.log(rooms);
								r++;
							}
						}
					}
				}
			}
			else{}
		}
		//socket.broadcast.emit('click', x, y);
	});
	
	socket.on('disconnect', function(){
		console.log('User ' + socket.id + ' disconnected.');
		playersonline--;
		for(var pl = 0; pl < players.length; pl++){
			if(players[pl].id == socket.id){
				players[pl].online = false;
				socket.broadcast.emit('playerdisconnect', players[pl]);
				
				if(players[pl].room >= 0&&players[pl].room!=null){
					rooms[((players[pl].room))] -= 1;
					console.log(rooms);
				}
			}
		}
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function player(id){
	this.name = adjectives[(Math.ceil(Math.random()*adjectives.length))-1]+"-"+nouns[(Math.ceil(Math.random()*nouns.length))-1]+"-"+(Math.ceil(Math.random()*1000));
	this.id = id;
	this.x = 0;
	this.y = 0;
	this.score = 0;
	this.alive = true;
	this.online = true;
	this.room = null;
	players.push(this);
	socketids.push(this.id);
}
