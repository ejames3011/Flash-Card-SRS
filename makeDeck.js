
class Deck { 

	constructor(name) {
		this.name = name;

		this.category;
		this.index; 
		this.decks = {
			"new": [],
			"newReview": [],
			"oldReview": []
		}

		this.chooseCategory();
		this.setIndex();
	
	}

	//Chooses review category at random.
	chooseCategory() {
		var deckArr = [];
		var reducedArr = []; 
		var ran;
		var deckSerial = {
			"new": 0,
			"newReview": 1,
			"oldReview": 2
		};

		//Sort keys of the decks object into deckArr array based on the deckSerial object.
		for (key in this.decks) {
			var serial = deckSerial[key]; 
			deckArr[serial] = key; 
			console.log("serialize keys " + deckArr[serial]); 
		};
	
		//reduce serialized deckArr array into array of keys that have flashcards
		for (var i = 0; i < deckArr.length; i++) {
			var key = deckArr[i];
			var deck = this.decks[key];
			console.log(deck);
			console.log(deck.length);
			if(deck.length != 0) {
				reducedArr.push(deckArr[i]); 
			}
			console.log("Reduce serial " + reducedArr);
		};

		//choose category giving preference to the newest deck.
		switch(reducedArr.length) {
			case 0: 
				this.category = "new";
				break;
			case 1:
				this.category = reducedArr[0];
				console.log("line 45 " + reducedArr[0]);
				break;
			case 2: 
				ran = Math.floor((Math.random() * 100) + 1);
				if (ran >= 30) {
					this.category = reducedArr[0];
					console.log(reducedArr[0]);
				} else {
					this.category = reducedArr[1];
					console.log(reducedArr[1]);
				}
				break;
			case 3: 
				ran = Math.floor((Math.random() * 3));
				this.category = reducedArr[ran];
				console.log(reducedArr[ran]);
		};
	};

	// Displays the front of a flash card at the current category and index.
	displayFront() {
		var value;
		var frame = document.getElementById("frame"); //the div where the card is displayed.
		//if the decks are empty display "this deck is empty"
		if (isEmpty(this.decks)) { 
			value = "This deck is empty."
		} else {
			var front = this.decks[this.category][this.index][0];
			value = front;
		}	
		frame.style.fontSize = "200px"; //Default max font size.
		frame.innerHTML = value;
		adjustText(value); // if default fonts size is to large adjust text to fit width of div.
	}

	//sets the index of the current category of array randomly.
	setIndex() {
		this.index = Math.floor((Math.random() * this.decks[this.category].length));
	}
	//displays the back of the current card at the current index and category.
	displayBack() {
		var value;
		var frame = document.getElementById("frame");
		if (isEmpty(this.decks)) {
			value = "This deck is empty."
		} else {
			console.log("from display back " + this.index + " " + this.category);
			console.log(this);
			console.log(this.decks[this.category][this.index][1]);
			value = this.decks[this.category][this.index][1];
		}
		frame.style.fontSize = "200px";
		frame.innerHTML = value;
		adjustText(value);
	}

	/* Updates the review count of the current card depending on the input of the user
	   if the user clicks know it increase the count if the user clicks don't know the
	   count is decreased. 
	   Once the review count of a card reaches 2 the card advances to the next category.
	   If the card reaches zero it is demoted to the previous category.
	   */
	updateCard(answer) {
		if(answer) {
		console.log("from update card " + this.category + " " + this.index);
		if  (this.decks[this.category][this.index][2] < 2) {
			this.decks[this.category][this.index][2] += 1;	
		} else {
			switch(this.category) {
				case "new":
					this.decks[this.category][this.index][2] = 0;
					this.decks["newReview"].push(this.decks[this.category][this.index]);
					this.decks[this.category].splice(this.index,1);
					break;
				case "newReview":
					this.decks[this.category][this.index][2] = 0;
					this.decks.oldReview.push(this.decks[this.category][this.index]);
					this.decks[this.category].splice(this.index, 1);
				}
			}	
		}

		if(answer === false) {
			if  (this.decks[this.category][this.index][2] > 0) {
				this.decks[this.category][this.index][2] -= 1;
			} else {
				switch(this.category) {
					case "oldReview":
						this.decks[this.category][this.index][2] = 0;
						this.decks.newReview.push(this.decks[this.category][this.index]);
						this.decks[this.category].splice(this.index, 1);
						break;
					case "newReview":
						this.decks[this.category][this.index][2] = 0;
						this.decks.new.push(this.decks[this.category][this.index]);	
						console.log("spliced " + this.decks[this.category].splice(this.index, 1));
				}	
			}
		}
	}

	//Updates the count on the display of how many cards are in each category. 
	updateCount() {
		var count;
		count = [this.decks["new"].length, this.decks["newReview"].length, this.decks["oldReview"].length];
		document.getElementById("new").innerHTML = count[0];
		document.getElementById("newReview").innerHTML = count[1];
		document.getElementById("oldReview").innerHTML = count[2];
	}

	//Pushes a new card to the current deck based on user input. 
	addCard(card) {
		this.decks.new.push(card);
	}

	//Deletes card from the current deck based on user input.
	deleteCard() {
		this.decks[this.category].splice(this.index, 1);
	}

};

//highlights the tab in the display of the deck that is passed to the function.
function activeDeck(deck) {
	var deckTabs = document.getElementsByClassName("tab");
	var activeDeck = document.getElementById(deck.name);

	for (i = 0; i < deckTabs.length; i++) {
		deckTabs[i].className = deckTabs[i].className.replace(" active-tab", "");
	}
	activeDeck.classList.add("active-tab");
}

//Displays the current state of the deck that is passed, and binds the UI to the deck.
function displayDeck(deck) {
	var count;
  	var controls = document.getElementById("controls");
  	var answer = document.getElementById("answer");
  	var know = document.getElementById("know");
  	var dont = document.getElementById("dont");
  	var title = document.getElementById("title");
  	var display = document.getElementById("frame");

	if(typeof deck !== "undefined" ) {

  		console.log(deck);
   		console.log("decks from display deck" + deck.decks.new);

   		if (typeof deck.category === "undefined") {
   			deck.chooseCategory();
   		}
   		console.log(deck.category);
   		console.log(deck);
   		activeDeck(deck);
		deck.displayFront();
  		console.log(deck.decks);
  		deck.updateCount();

  		//Some JQuery to demonstrate JQuery skills.
  		$(".controls").css("display", "none");
		$(".answer").css("display", "block");
  		$(".title").html(deck.name);

  		//Displays the back of the current card.
  		answer.onclick = function(event) {
  			if (isEmpty(deck.decks)) {
			frame.innerHTML = "This deck is empty."
			} else {
  				answer.style.display = "none";
  				controls.style.display = "block";
  				deck.displayBack();
  			}
  		}
  		//If user knows the card advance the count of the card.
		know.onclick = function(event) {
			controls.style.display = "none";
			answer.style.display = "block";

			deck.updateCard(true); //True advances the card.
			deck.updateCount();

			deck.chooseCategory();
			deck.setIndex();
			deck.displayFront();

		} 

		//If user doesn't know the card demote the card.
		dont.onclick = function(event) {
			controls.style.display = "none";
			answer.style.display = "block";

			deck.updateCard(false); //False demotes the card.
			deck.updateCount();

			deck.chooseCategory();
			deck.setIndex();
			deck.displayFront();
		}
	}
}

function clearDisplay() {
    var answer = document.getElementById("answer");
    var know = document.getElementById("know");
    var dont = document.getElementById("dont");
    var title = document.getElementById("title");
    var newCards = document.getElementById("new");
    var newReview = document.getElementById("newReview");
    var oldReview = document.getElementById("oldReview"); 
    var display = document.getElementById("frame");

    answer.onclick = function(){};
	know.onclick = function(){};
	dont.onclick = function(){};
	controls.onclick = function(){};

	title.innerHTML = "Empty";
	newCards.innerHTML = 0;
	newReview.innerHTML = 0;
	oldReview.innerHTML = 0;
	display.innerHTML = "No deck is loaded";
	adjustText(display.innerHTML);
}

//Recursively determines which font size will fit the with of the display.
function adjustText(text) {
	var frame = document.getElementById("frame");
	var fontsize = window.getComputedStyle(frame, null).getPropertyValue('font-size');
	var measureText = document.getElementById("measure-text");
	measureText.innerHTML = text; 
	measureText.style.fontSize = fontsize;
	var width = (measureText.clientWidth + 1);
	
	if (frame.clientWidth < width) {
		fontsize = parseInt(fontsize) - 10;
		frame.style.fontSize = fontsize + "px";
		this.adjustText(text);
	}
}

//Returns true if obj is undefined or if the arrays in the object are zero.
function isEmpty(obj) {
	var empty;
	console.log(obj);
	console.log(obj["new"]);
	console.log(typeof obj);
	if (Object.keys(obj).length === 0) {
		empty = true;
		return empty;
	} else {
		for (var key in obj) {
			console.log(obj[key]);
			if (obj[key].length === 0) {
				empty = true;
				console.log("is empty value " + empty);
			} else {
				empty = false;
				return empty;
			}
		console.log(empty);
		}
		return empty;
	}	
}




