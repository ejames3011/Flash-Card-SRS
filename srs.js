/*This is a sysematic repetition system application.  The user can create their 
own flashcard deck.  A flashcard deck holds flashcards, each flash card has a
and back.  There are three levels of review frequency "new", "new review", and 
"old review".  When the front is displayed the user clicks the answer button to display
the back.  Then the user can choose "Know" or "Don't Know".  If the user chooses 
"Know" the card's review count is incremented

Created by: James Evans
*/

var deckObjects = {}; //Object that stores all flashcard decks that are created. 
window.onload = function() {
	start();

	/*Loads data stored in the browser's localStorage from the previous session.
	Creates and displays decks based on stored data.  If now data was stored 
	it creates a default deck with hardcoded values.  */
	function start() {
		var deckData = {}
		var deckTabs;
		var deckName; 
		console.log(localStorage);
		if (isEmpty(localStorage) === false) {
			console.log(deckData);
			for (var key in localStorage) {
				addDeck(key);
				deckData = JSON.parse(localStorage[key]);
				console.log(deckData);
				deckObjects[key].category = deckData.category;
				deckObjects[key].index = deckData.index;
				deckObjects[key].decks = deckData.decks;
				console.log(deckData);
				console.log(deckObjects);
			}
		} else {
			addDeck("default");
			console.log("did it add a deck");
	
			var defaultCards = [["red", "赤い", 0],["blue", "青い", 0],["green","緑",0]];
			for (i = 0; i < defaultCards.length; i++) {
				deckObjects["default"].addCard(defaultCards[i]);
			}
			console.log(deckObjects["default"].chooseCategory());
			displayDeck(deckObjects.default);

		}

		deckTabs = document.getElementsByClassName("tab");
		deckName = deckTabs[0].getAttribute("id"); 
		displayDeck(deckObjects[deckName]);


	}
	
	/*Adds new deck to deckObjects based on user input and dynamically creates
	a deck tab in the UI.*/
	function addDeck(name) {
		deckObjects[name] = new Deck(name);
		console.log(deckObjects[name].new);
		console.log(deckObjects[name]);
		console.log(deckObjects);

		var deck = document.createElement("DIV");
		console.log(name);
		var deckText = document.createElement("DIV");
		deckText.className += " tab-label";
		t = document.createTextNode(name);
		deckText.appendChild(t);
		deck.appendChild(deckText);
		deck.setAttribute("id", name);
		deck.className += " tab";

		var deckMenu = document.getElementById("deck-menu");
		deckMenu.appendChild(deck);
		
		//Add Card Button for user to add new card.
		var addCardButton = document.createElement("button");
		var btnText = document.createTextNode("Add Card");
		addCardButton.appendChild(btnText);
		// On click the add card button creates a user input form. 
		addCardButton.onclick = function(event) {
			addCardForm(name);
		}

		deck.appendChild(addCardButton);	
		//On click the deck is displayed and the UI updated.
		deck.addEventListener("click", function (event) {
			console.log(event.target);
			if (event.target !== addCardButton) {		
				console.log("from deck " + name);			
				displayDeck(deckObjects[name]);
				console.log("here");
			}
			
		});
	
	};
	//input form to add card to selected deck.
	function addCardForm(name) {
		var addCardModal = document.getElementById("add-card-modal");
		var invalid = document.getElementById("card-invalid");
		invalid.style.display = "none"; 
		addCardModal.style.display = "block";
	
		var addCardClose = document.getElementById("card-close");
		var btnCreateCard = document.getElementById("create-card");
		var cardFront = document.getElementById("card-front");
		var cardBack = document.getElementById("card-back");
		cardFront.value = "";
		cardBack.value = "";
		cardFront.focus();
		console.log(addCardClose);

		/*Collects user input and calls the decks add Card function which
		pushes the user input to the selected deck.  If the user doesn't input
		front and back card card is not added and the user is notified.*/
		btnCreateCard.onclick = function(event) {
			if(cardFront.value != "" && cardBack.value != "") {
				console.log(cardFront.value);
				deckObjects[name].addCard([cardFront.value, cardBack.value, 0]);
				addCardModal.style.display = "none";
				displayDeck(deckObjects[name]);
				cardFront.value = "";
				cardBack.value = "";
			} else if (cardFront.value === "" && cardBack.value === "") {
				invalid.innerHTML = "&#10006 Please enter values for Front Card and Back Card";
				invalid.style.display = "block";
			} else if (cardFront.value === "") {
				invalid.innerHTML = "&#10006 Please enter values for Front Card";
				invalid.style.display = "block";
			} else if (cardBack.value === "") {
				invalid.innerHTML = "&#10006 Please enter values for Back Card";
				invalid.style.display = "block";
			}

		};

		//Closes form
		addCardClose.onclick = function(event) {
			console.log("clicked close");
			addCardModal.style.display = "none";
		};
		//Closes form if user clicks outside of form.
		window.onclick = function(event) {
			if (event.target == addCardModal) {
				addCardModal.style.display = "none";
			}
		};

	};

	//Removes deck from deckObjects based on the deck name that is passed.
	function removeDeck(name) {
		var tab = document.getElementById(name);
		var deckTabs = [];
		var emptyDeck;
		delete deckObjects[name];
		tab.parentElement.removeChild(tab);
		console.log(deckObjects[name]);

		if(isEmpty(deckObjects) === false) {
			deckTabs = document.getElementsByClassName("tab");
			deckTabs.classList.add("active-tab");
		} else {
			console.log("hello");
			clearDisplay();
		}
	}

	/* Displays the add deck form. calls the addDeck Function add creates a deck
	with the deck name given by the user.  If the user doesn't enter a deck name
	no deck is created and the user is warned.*/
	var btnAddDeck = document.getElementById("add-deck");
	btnAddDeck.onclick = function(event) {
		var addDeckModal = document.getElementById("add-deck-modal");
		var invalid = document.getElementById("deck-invalid");
		invalid.style.display = "none";
		addDeckModal.style.display = "block";
	
		var span = document.getElementById("close");
		var btnCreateDeck = document.getElementById("deck-create");
		var deckName = document.getElementById("deck-name");
		deckName.value = "";
		deckName.focus();
		
		/*On click the create deck button calls the addDeck Function or warns
		the user that no name was entered*/
		btnCreateDeck.onclick = function(event) {
			if(deckName.value != "") {
				addDeck(deckName.value);
				addDeckModal.style.display = "none";
			} else {
				invalid.innerHTML = "&#10006 Please enter a flash card deck name.";
				invalid.style.display = "block";
			}
		};

		span.onclick = function(event) {
			addDeckModal.style.display = "none";
		};

		window.onclick = function(event) {
			if (event.target == addDeckModal) {
				addDeckModal.style.display = "none";
			}
		};
	};

	//On click the remove deck button calls the removeDeck function for the current active deck.
	var btnRemoveDeck = document.getElementById("remove-deck");
	btnRemoveDeck.onclick = function(event) {
		var activeDeck = document.getElementsByClassName("active-tab");
		console.log(activeDeck);
		var deckName = activeDeck[0].getElementsByClassName("tab-label")[0].innerHTML;
		console.log(deckName);
		removeDeck(deckName);
	}

	/* displays the delete card form and prompts the user to verify that they
	want to delete the current card. */
	var btnDeleteCard = document.getElementById("delete-card");
	btnDeleteCard.onclick = function() {
		var deleteCardModal = document.getElementById("delete-card-modal");
		var span = document.getElementById("delete-close");
		var yes = document.getElementById("delete-yes");
		var no = document.getElementById("delete-no");
		var title = document.getElementById("title");
		deleteCardModal.style.display = "block";

		yes.onclick = function(event) {
			var name = title.innerHTML;
			deckObjects[name].deleteCard();
			console.log(deckObjects[name]);
			deckObjects[name].chooseCategory();
			deckObjects[name].setIndex();
			displayDeck(deckObjects[name]);
			deleteCardModal.style.display = "none";
		}

		no.onclick = function(event) {
			deleteCardModal.style.display = "none";
		}

		span.onclick = function(event) {
			deleteCardModal.style.display = "none";
		}

		window.onclick = function(event) {
			if (event.target == deleteCardModal) {
				deleteCardModal.style.display = "none";
			}
		}
	};

};

/*takes the information stored in the deckObjects object, and converts
the data into JSON then stores the data in the browser's local storage. */
window.onbeforeunload = function() {
	console.log(deckObjects);
    console.log("why japanese people");
	localStorage.clear();
		if (isEmpty(deckObjects)) {
			console.log("deckObjects is empty");
		} else {
			for (var key in deckObjects) {
				var deckData = {};
				console.log(deckObjects);
				console.log(deckObjects[key]);
				deckData["decks"] = deckObjects[key].decks;
				deckData["category"] = deckObjects[key].category;
				deckData["index"] = deckObjects[key].index;

				var JSONReadyDeckData = JSON.stringify(deckData);


				localStorage.setItem(key, JSONReadyDeckData);
		
			}
		} 
};
