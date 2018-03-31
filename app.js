"use strict";
function myCode() {
  const deck = $('.deck');
  /*
  * Create a list that holds all of my cards
  */
  let cards = document.getElementsByClassName("card");
  let cardsArray = [...cards];
  let moves, failedMoves, matches, status, time = 0;
  let stars = $("#stars");
  let starCount = 3;
  let modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  let closeModal = document.getElementsByClassName("close")[0];
  // One array to save all the matches card and one to help me make the comparison
  let matchedCards = [];
  let  openCards = [];

  // I'll create a timer that will lively show on the webpage as showed in this tutorial: https://www.youtube.com/watch?v=iSLWtGAw1Ic
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

  // I start the stopwatch on pageload
  document.addEventListener("DOMContentLoaded", function() {
    startTimer();
  });

  // A function that restarts the game without page reload, it also shuffles the cards
  function restartGame() {
    let MoveShow = document.getElementById("moves");
    MoveShow.textContent = "0 Moves";
    moves = 0;
    failedMoves = 0;
    matches = 0;
    starCount = 3;
    openCards = [];
    matchedCards =[];
    // I'll re-initialize the rating to be 3 stars
    stars.children().remove();
    stars.append("<li><i class=\"fa fa-star\"></i></li>\n<li><i class=\"fa fa-star\"></i></li>\n<li><i class=\"fa fa-star\"></i></li>");
    // Shuffle the cards and replace them on the deck
    shuffle(cardsArray);
    deck.children().remove();
    let i = 0;
    for (let card of cardsArray) {
      i += 1;
      card.classList.remove("open");
      card.classList.remove("show");
      card.classList.remove("match");
      // I add an id for each card it will help me later on
      card.setAttribute("id", "card" + i);
      deck.append(card);
    }
    restartTimer();
    timer();
  }

  // Also call this function on page load so that the shuffle happens anyway
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

  // When the restart button is clicked call the restartGame function
  const restart = $('.restart');
  restart.click(function() {
    restartGame();
  });


  function cardShow(clickedCard) {
    clickedCard.classList.add("open");
    clickedCard.classList.add("show");
  }

  function cardHide(card) {
    card.classList.remove("open");
    card.classList.remove("show");
    card.classList.remove("reject");
  }

  // This function will create an effect for wron guesses
  function redReject(card1, card2) {
    setTimeout( function() {
      card1.classList.add("reject");
      card2.classList.add("reject");
    }, 400);
  }

  // This function will make sure cards are visible before being closed after a wrong guess
  function delayedHide(card1, card2) {
    setTimeout( function() {
      cardHide(card1);
      cardHide(card2);
    }, 1200);
  }

  // A function to push a clicke dcard for comparison
  function addOpened(clickedCard) {
    openCards.push(clickedCard);
  }

  // A function to store matched cards
  function addMatched(card) {
    matchedCards.push(card);
  }

  // lear right click menu inside the deck
  deck.contextmenu(function(evt) {
    evt.preventDefault();
  });

  // The event listener for clicking a card, this is where all the magic happens
  deck.on("click", ".card", function(evt) {
    let target = $(evt.target);
    let targetId = target.attr("id");
    let targetedEl = document.getElementById(targetId);
    // I wrote two loops to prevent problems when user clicks an open card
    for (const card of matchedCards) {
      let cardId = card.getAttribute("id");
      if (cardId === targetId) {
        return false;
      }
    }
    for (const card of openCards) {
      let cardId = card.getAttribute("id");
      if (cardId === targetId) {
        return false;
      }
    }
    // So if a card is opned or matched kill the handler, even though it works there might be some errors in dev tools

    cardShow(targetedEl);
    addOpened(targetedEl);
    let numOfOpen = openCards.length;
    if (numOfOpen === 2) {
      moves += 1;
      countMove(moves);
      // If two card have been clicked I can compare them
      let firstIcon = openCards[0].innerHTML;
      let secondIcon = openCards[1].innerHTML;
      if (firstIcon !== secondIcon) {
        delayedHide(openCards[0], openCards[1]);
        redReject(openCards[0], openCards[1]);
        failedMoves += 1;
        // Check if the user loses a star
        rating(failedMoves);
      }
      else {
        for (const card of openCards) {
          card.classList.add("match");
          addMatched(card);
        }
        matches += 1;
        // If the user made 8 matches of 16 cards he has won
        if (matches === 8) {
          won();
        }
      }
      // After a comparison clear the array that stores the compared cards for next use
      openCards = [];
    }
  });

  // A function that counts every move and projects it on the website
  function countMove(numOfMoves) {
    let MoveShow = document.getElementById("moves");
    MoveShow.textContent = numOfMoves + " Moves";
  }

  // A function that lowers the rating after some wrong guesses
  function rating(numOfMistakes) {
    if ((numOfMistakes === 9)||(numOfMistakes === 12)) {
      stars.children().last().remove();
      starCount -= 1;
    }
  }

  /* A function that runs once the user wins. It shows the popup modal. It pulls the values of time and rating
  and displays them to the user,
  also gives to the user the ability to restart the game */
  function won() {
    stopTimer();
    let rating = document.getElementById("stars").innerHTML;
    let ratingModal = document.getElementById("stars-modal");
    ratingModal.innerHTML = rating;
    let time = document.getElementById("timerLabel").textContent;
    let timeModal = document.getElementById("time-modal");
    timeModal.textContent = "Time:   " + time;
    // I can break it to min sec and ms later
    modal.style.display = "block";

    let replay = $("#replay");
    replay.click(function() {
      modal.style.display = "none";
      restartGame();
    });

    // When the user clicks on <span> (x), close the modal
    closeModal.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
}
$(myCode());
