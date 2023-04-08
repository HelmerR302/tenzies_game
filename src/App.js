import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";
import Die from "./components/Die";
const { v4: uuidv4 } = require("uuid");

function App() {
  //* A state hold the array and initiate with array function
  //* Array has 10 die objects with random num between 1-6
  const [diceArray, setDiceArray] = useState(randomDice());

  //* Set wining status, when conditions are met, setTenzies to be true and end the game
  const [tenzies, setTenzies] = useState(false);

  //* Round track: everytime roll dice, setCount + 1; reset when new game start
  const [roundCount, setRoundCount] = useState(0);

  //* Set message for the game status
  const [message, setMessage] = useState("");

  //* Check diceArray for winning conditions: when all conditions are met, setTenzies to true
  //* 1. all dice isHeld:true
  //* 2. all dice value are equal
  //? useEffect to sync 2 internal state: diceArray and tenzies
  useEffect(() => {
    // console.log("dice array changed");
    const allHeld = diceArray.every((die) => die.isHeld === true);
    const allEqual = diceArray.every((die) => die.value === diceArray[0].value);

    if (allHeld && allEqual) {
      // console.log("you won");
      setTenzies(true);
      setMessage("🥳 You won!");
    } else if (allHeld === true && allEqual === false) {
      // console.log("dice value are not equal");
      setMessage("⚠️ Selected dice are not matched");
    } else {
      setMessage("");
    }
  }, [diceArray]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: uuidv4(),
    };
  }

  function randomDice() {
    const newDiceArray = [];
    for (let i = 1; i < 11; i++) {
      newDiceArray.push(generateNewDie());
    }
    return newDiceArray;
  }
  // console.log(randomDice());

  //* Fix dice with isHeld: true, don't roll them again ------------------------
  //* Reset the game: if tenzies === true, reset 2 states; else freeze held dice
  function rollDice(id) {
    if (tenzies) {
      setDiceArray(randomDice());
      setTenzies(false);
      setRoundCount(0);
      setMessage("");
    } else {
      setDiceArray((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRoundCount((prevCount) => (prevCount += 1));
    }
  }

  //* Flip the isHeld property on dice object based on id ------------------------
  function holdDice(id) {
    // console.log(id)
    setDiceArray((prevDice) =>
      prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const dieElement = diceArray.map((die) => (
    <Die
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      // Using callback function to call holdDice() to pass parameter to the function
    />
  ));

  //* width & height for confetti
  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <main>
      {tenzies && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={800}
          tweenDuration={10000}
        />
      )}
      <h1 className="title">Tenzies</h1>
      <div className="description">
        <p>How to win:</p>
        <p>
          Click dice with same number to freeze it. Roll again, untill all dice
          are the same.
        </p>
      </div>
      <p className="round-count">Round: {roundCount}</p>
      <div className="dice-container">{dieElement}</div>
      <p className="message-alert">{message}</p>
      <button
        className="roll-button"
        style={
          tenzies
            ? { backgroundColor: "#4A18F7" }
            : { backgroundColor: "#ff7b54" }
        }
        onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
