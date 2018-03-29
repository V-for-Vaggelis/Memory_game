"use strict";
function myCode() {
    /*
   * Create a list that holds all of your cards
   */
   const deck = $('.deck');
   let cards = document.getElementsByClassName("card");
   let cardsArray = [...cards];
   let moves = 0;
   let failedMoves =0;
   let stars = $("#stars");
   let starCount = 3;
   let matches = 0;
   let status = 0;
   let time = 0;

   function startTimer() {
     status = 1;
     timer();
   }

   function stopTimer() {
     status = 0;
   }

   function restartTimer() {
     status = 1;
     time = 0;
   }

   // Stopwatch from: https://www.youtube.com/watch?v=gpFPppFU8s8
   function timer() {
     if (status === 1) {
       setTimeout(function() {
         time++;
         var min = Math.floor(time/100/60);
         var sec = Math.floor(time/100);
         var msec = time % 100;
         if (min < 10) {
           min = "0" + min;
         }
         if (sec >= 60) {
           sec = sec % 60;
         }
         if (sec < 10) {
           sec = "0" + sec;
         }
         document.getElementById("timerLabel").textContent = min + ":" + sec + ":" + msec;
         timer();
       }, 10);
     }
   }

   document.addEventListener("DOMContentLoaded", function() {
     startTimer();
   });

  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */
   function restartGame() {
     let MoveShow = document.getElementById("moves");
     MoveShow.textContent = "0 Moves";
     moves = 0;
     failedMoves =0;
     matches = 0;
     starCount = 3;
     stars.children().remove();
     stars.append("<li><i class=\"fa fa-star\"></i></li>\n<li><i class=\"fa fa-star\"></i></li>\n<li><i class=\"fa fa-star\"></i></li>");
     shuffle(cardsArray);
     deck.children().remove();
     let i = 0;
     for (let card of cardsArray) {
       i += 1;
       card.classList.remove("open");
       card.classList.remove("show");
       card.setAttribute("id", "card" + i);
       deck.append(card);
     }
     restartTimer();
   }

   restartGame();
  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }

      return array;
  }


  const restart = $('.restart');
  restart.click(function() {
    restartGame();
  });

  /*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
   */
   function cardShow(clickedCard) {
     clickedCard.addClass("open show");
   }

   function cardHide(card1, card2) {
     card1.classList.remove("open");
     card1.classList.remove("show");
     card2.classList.remove("open");
     card2.classList.remove("show");
   }

   function delay(card1, card2) {
    setTimeout( function(){ cardHide(card1, card2); }, 1000);
  }

   let openCards = [];

   function addOpened(CardId) {
     let clickedCard = document.getElementById(CardId);
     openCards.push(clickedCard);
   }

  let matchedCards = [];

  /*function addMatched(card1, card2) {
    let firstCardId = card1.attr("id");
    let firstCardDOM = document.getElementById(firstCardId);
    matchedCards.push(firstCardDOM);
    let SecondCardId = card2.attr("id");
    let SecondCardDOM = document.getElementById(SecondCardId);
    matchedCards.push(SecondCardDOM);
  }*/


  deck.on("click", ".card", function(evt) {
   let target = $(evt.target);
   let targetId = target.attr("id");
   cardShow(target);
   addOpened(targetId);
    let numOfOpen = openCards.length;
    if (numOfOpen === 2) {
      moves += 1;
      countMove(moves);
     let firstIcon = openCards[0].innerHTML;
     let secondIcon = openCards[1].innerHTML;
     if (firstIcon !== secondIcon) {
       delay(openCards[0], openCards[1]);
       failedMoves += 1;
       rating(failedMoves);
     }
     else {
       matches += 1;
       // addMatched(openCards[0], openCards[1]);
       if (matches === 8) {
         Won();
       }
     }
     openCards = [];
   }
 });

function countMove(numOfMoves) {
  let MoveShow = document.getElementById("moves");
  MoveShow.textContent = numOfMoves + " Moves";
}

 function rating(numOfMistakes) {
   if ((numOfMistakes === 5)||(numOfMistakes === 8)) {
     stars.children().last().remove();
     starCount -= 1;
   }
 }

 function Won() {
   stopTimer();
   /*deck.children().remove();
   const message = "<h1>Congratulations!!!</h1>"
   let stars;
   let starsCode;
   for (let i=0; i<starCount; i++) {
     stars += "<li><i class=\"fa fa-star\"></i></li>\n";
   }
   starsCode = "<ul>\n" + stars + "</ul>";
   let rating = "<h3>Your rating: </h3>";
   let button = "<button type=\"button\">Play again!</button>";
   deck.append(message);
   deck.append(rating);
   deck.append(starsCode);
   deck.append(button);
   // deck.innerHTML = "<h1> Congratulations!!!</h1>";
 }*/
  }

}
$(myCode());
