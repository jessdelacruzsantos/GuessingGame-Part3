////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Game object functions//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}


function newGame() {
    return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if(isNaN(guess) || guess < 1 || guess > 100) {
        outPut("That is an invalid guess.");
        throw "That is an invalid guess.";
    }

    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber) {
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                return 'You Lose.';
            }else {
                var diff = this.difference();
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}

function higherOrLower(boo) {
    if (boo) {
        return ` Guess Higher!`;
    } else {
        return `, Guess lower!`;
    }
}
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Functions for HTML changes ////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function logGuess(mess, game) { // Depending on message different actions are taken

    if (mess === 'You have already guessed that number.' ) {
        $('#title').text(mess); // If guess is duplicate makes message
    } else {
        // if not duplicate it makes the onscreen inputs mirror the inputs in game.pastGuesses
        $('#guess-list li').each(function(index, li){ 
            if (game.pastGuesses[index]){ 
                $(li).text('' + game.pastGuesses[index]);
            }
        });
        //
        if (mess === 'You Lose.') {
            $('#title').css('color','red').text(mess);
            $('#subtitle').text('Press the Reset Button.');
            disableButtons();
        } else if ( mess === 'You Win!') {
            $('#title').css('color','green').text(mess);
            $('#subtitle').text('Press the Reset Button.');
            disableButtons();} 
        else { 
            outPut( mess + higherOrLower(game.isLower()) );
        }
    }
}
function outPut(str) {
    $('#out-put-message').css('color','blue').text(str);
    $('#out-put-message').show();
}

function makeAGuess(game) { // Extracts value from player input and gets message
    var guess = $('#player-input').val();
    var mess = game.playersGuessSubmission(parseInt(guess, 10));

    $('#player-input').val('');
    defaultTitles();

    logGuess(mess, game);
}
function disableButtons() {
    $('#submit').attr('disabled', true);
    $('#hint').attr('disabled', true);
}
function enableButtons() {
    $('#submit').attr('disabled', false);
    $('#hint').attr('disabled', false);
}
function defaultTitles() {
    $('#title').css('color', 'black').text('Play the Guessing Game!');
    $('#subtitle').css('color', 'black').text('Guess a number between 1-100!');
    $('#out-put-message').hide();
    $('#hint-limit').hide();
}

function defaultInputs() {
    $('#player-input').val('');
    $('.guess').text('-');
}

function oneTime(func) {
    var executed = false;

    return function (input) {
        if (!executed ) {
            executed = true;
            return func(input);
        } else {
            $('#out-put-message').toggle();
            $('#hint-limit').toggle();
            //func("You only get one hint!!!")
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Game in Jquery/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
$(document).ready(() => {
    console.log('We in here')
    let game = newGame();
    let onceOutPut = oneTime(outPut);

    $('.btn-success').on('click', () => { //Pressing submit logs info in game obj and logs a message
        makeAGuess(game);
    });
    $('#player-input').keypress(function(event) { //When enter is pressed player logGuess is called
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })
    $('#reset').on('click', () => { //Sets game to a new Game
        game = newGame();
        onceOutPut = oneTime(outPut);
        defaultTitles();
        defaultInputs();
        enableButtons();
    });
    $('#hint').on('click', () => { // Logs the hint
        
        var mess = game.provideHint().toString();

        onceOutPut(`Here is your hint: \n[${mess}]`);
    });
});
