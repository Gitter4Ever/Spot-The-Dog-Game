var model={ //model object , property
	boardSize :7, //size of board is 7 X 7
	numDogs: 3,  //number of dogs to be spotted to count as 1
	dogsSpotted:0, //number of Dogs Spotted
	dogsLength:3, //3 dogs are to be spotted to count as 1 hit
	
	dogs:[						//'dogs' is a property of object 'model' ,  it is an array of objects 'dog'; 
			{locations:[0,0,0], hits:["","",""]},
			{locations:[0,0,0], hits:["","",""]},
			{locations:[0,0,0], hits:["","",""]}
	
	],
	
	fire : function(guess){
			for(var i=0;i<this.numDogs;i++){
				var doggy=this.dogs[i];
				//var doggyLocations=doggy.locations;
				var index=doggy.locations.indexOf(guess);
				if(index >=0){
					doggy.hits[index]="hit";
					view.displayHit(guess);
					view.displayMessage("Good...Found Me !");
					if(this.isSpotted(doggy)){
							this.dogsSpotted++;
							view.displayMessage("Weldone!!!");
					}
					return true;			
				}
			}
			view.displayMiss(guess);
			view.displayMessage("You are following me!!");
			return false;
		},
	isSpotted: function(doggy){
		for(var i =0;i<this.dogsLength;i++){
			if(doggy.hits[i]!=="hit"){
				return false;
			}			
		}
		return true;
	},
	generateDoggyLocations: function(){  //--pp
		var locations;
		for(var i = 0;i< this.numDogs;i++){
			do{
				locations = this.generateDoggy();
			}while(this.collision(locations));
			this.dogs[i].locations = locations;
		}
		
	},
	
	generateDoggy: function(){         //--pp
		var direction = Math.floor(Math.random()*2);
		var row, col;
		
		if(direction === 1){  //horizontal direction to place 3 dogs in an array
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.dogsLength));
		}
		else{
			
			row = Math.floor(Math.random() * (this.boardSize - this.dogsLength));			
			col = Math.floor(Math.random() * this.boardSize);
		}
		
		var newDoggyLocations = []; //3 continuous locations to be decided
		for(var i =0; i< this.dogsLength; i++){
			if(direction === 1){
				newDoggyLocations.push(row + ""+(col + i));
			}
			else{
				newDoggyLocations.push((row +i)+""+ col);
			}
		}
		return newDoggyLocations;
	},
	collision: function(locs){             //--pp
		//locs is an array of locations for a new ship we'd like to place on the board
		for(var i =0;i< this.numDogs; i++){ //3 locations will get checked
			var dog = model.dogs[i]; 
				for(var j =0;j< locs.length ;j++){
					if(dog.locations.indexOf(locs[j])>= 0){
						return true; //true that means there is a collision
					}
				}
		}
		return false;  //false if no collision is there
	}
}

var view={
	displayMessage: function(msg){ // the display method takes one argument, a msg.
		var messageArea = document.getElementById("messageArea"); //We get the messageArea element from the page.
 		messageArea.innerHTML = msg; //..and update the text of the messageArea element by setting its innerHTML to msg
	},
	displayHit: function(location){//location is created by row and column and matches an id of a <td> element
		var cell=document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var cell=document.getElementById(location); //getElementbyID : using the ID created from 
		cell.setAttribute("class","miss");								//player's guess to get the correct element to update
	}													//setting the class of that elemnet as miss
}


var controller={
	guesses :0,
	processGuess: function(guess){
		var location=parseGuess(guess);
		if(location){
			this.guesses++;
			var hit=model.fire(location);
			if(hit && model.dogsSpotted===model.numDogs){
				view.displayMessage("You spotted all funny Dogs in :  "+ this.guesses+ " guesses");
			}
			
		}
	}
}

function parseGuess(guess){
		var alphabet=["A","B","C","D","E","F","G"];
		if(guess===null || guess.length!=2 ){
			alert(guess+" is Invalid Guess");
		}
		else{
				firstChar=guess.charAt(0);
				var row= alphabet.indexOf(firstChar.toUpperCase());
				var column=guess.charAt(1);
				
				if(isNaN(row) ||isNaN(column) ){
					alert("Oops, Not a number!!");
				}
				else if(row < 0 ||row >= model.boardSize || column < 0||column >= model.boardSize){
					alert("Oops, Not on borad!!");
				}
				
				else{
					
					return (row+column);
				}
			}
		return null;
}
	

function handleFireButton(){
	var guessInput= document.getElementById("guessInput");
	var guess= guessInput.value;
	
	controller.processGuess(guess);
	
	guessInput.value = "";
}
function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	
	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}
window.onload = init;

	function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateDoggyLocations(); //--pp
}
	