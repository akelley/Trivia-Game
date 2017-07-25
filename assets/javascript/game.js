var game = {
	correct: 0,
	pageCounter: 0,
	clickCounter: 0,	
	question: "Question #",
	questions: ["When did dinosaurs go extinct?", "What color were dinosaurs?", "Which of these dinosaurs was most like a rhinoceros?",
				"Who first coined the term 'dinosauria'?", "During what period did Tyrannosaurus Rex live?", "What caused the extinction of the dinosaurs?",
				"What were the largest dinosaurs?", "Which of these is NOT a dinosaur?", "Which dinosaur family was the smartest?", "What is the largest animal that ever lived?"],
	choices: ["15,000 years ago", "65 million years ago", "1 billion years ago", "Green", "Grey", "Unknown", "Saltopus", "Stegosaurus", "Triceratops", 
			  "Joseph Leidy", "Charles Darwin", "Sir Richard Owen", "Cretaceous", "Triassic", "Jurassic", "an asteroid hitting the earth", "a virus", "mankind", 
			  "Sauropods", "Tyrannosaurs", "Troodons", "Apatosaurus", "Pterodactyl", "Megalosaurus", "Dromaeosaurids", "Oviraptors", "Tyrannosaurids", "Supersaurus",
			  "Blue whale", "Wooly Mammoth"],
	answerKey: [1, 2, 2, 2, 0, 0, 0, 1, 0, 1],  /* or more simply: #1 - 65 million years ago, #2 - Unknown, #3 Triceratops, #4 - Sir Richard Owen, #5 - Cretaceous, 
					   											   #6 - An asteroid, #7 - Sauropods, #8 - Pterodactyl, #9 - Dromaeosaurids & #10 - Blue Whale (really)*/
	loadQuestion: function(){
		$("#timer, #choices").css("display", "inline-block");
		$("#question-number").text(game.question + (game.pageCounter) + ":").css("display", "inline-block");
		$("#question").text(game.questions[game.pageCounter - 1]);
		
		
		for(var i = 0; i < 3; i++){	
			$("#question-" + (i+1)).text(game.choices[((game.pageCounter - 1) * 3) + i]);
		}
	},

	showScore: function(){
		// get rid of everything on the page and display number of correct answers
		$("#advance, #timer, #choices, #question, #question-number").css("display", "none"); 		
		$("#results").css("display", "block");
		$("#results").html("<p>CONGRATULATIONS!</p><p>You got " + game.correct + " out of 10 questions right.<br>Click RESTART to try again!</p><br>");
	},

	showScoreTimeout: function(){
		// could have made it the same as showScore(), but wanted a slightly different look for a timeout
		$("#choices, #question, #advance").css("display", "none");
		$("#timeout").css("display", "block");
		$("#timeout").html("<p>TIMEOUT!</p><p>You got " + game.correct + " out of 10 questions right.<br>Click RESTART to try again!</p><br>");
	}
};

var timer = {
	time: 10,

	reset: function(){
		timer.time = 10;
		$("#timer").html("0:10");
	},

	start: function(){
		$("#timer").html("0:10");
		counter = setInterval(timer.count, 1000);
	},

	stop: function(){
		clearInterval(counter);
	},

	count: function(){
		timer.time--;
		var converted = timer.timeConverter(timer.time);
		$("#timer").html(converted);		
	},

	timeConverter: function(seconds){
		if(seconds < 10){
			seconds = "0" + seconds;
		}

		if(seconds == 0){
		// if we run out of time to answer a question --> automatic end of game
			timer.stop();
			game.showScoreTimeout();
		}
		return "0:" + seconds;
	}
};


$("#advance").text("START");
$(document).ready(function(){
	$("#advance").on("click", function(){
		if(game.pageCounter == 0){
			// for intro page (no questions)
			$("#intro").css("display", "none");
			$("#advance").css("margin-top", "71px").text("NEXT");
			game.pageCounter++;
			game.clickCounter++;
		}

		if(game.pageCounter > 0){
			// for questions 1 - 10
			game.loadQuestion();
			
			// check to see which answer is checked
			var radioButtons = $("input:radio[name='radio-group']");
			var checkedRadioButton = radioButtons.filter(":checked");
			selectedIndex = radioButtons.index(checkedRadioButton);
		
			// if selectedIndex indicates a selection hasn't yet been made
			// and no other extranneous clicks on #advance button have been made
			// then reset/start timer
			if(selectedIndex < 0 && game.clickCounter == game.pageCounter){
				timer.reset();
				timer.start();
				game.clickCounter--;
			}

			// if selection has been made & there's still time on the clock 
			// (therefore, a valid answer), check to see if it was the correct 
			// answer; if so, then increment correct and pageCounter, reset/start 
			// the timer and load the next question
			if(selectedIndex > -1 && $("#timer").text() !== "0:00"){
				timer.stop();
		
				if(selectedIndex == game.answerKey[game.pageCounter - 1]){
					game.correct++;
				}

				checkedRadioButton.prop("checked", false);
				game.pageCounter++;
				timer.reset();
				timer.start();
				game.loadQuestion();
			}
		}

		if(game.pageCounter > 10){	
			// end of questions; stop timer & show score
			timer.stop();
			game.showScore();
		}
	});

	if($("#restart").on("click", function(){	
		// reloads game, of course
		location.reload();
	}));
});