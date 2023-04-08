import React from "react";

//* Conditional background to dice, when isHeld: true, show #59E391

function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      <h2>{props.value}</h2>
    </div>
  );
}

export default Die;
