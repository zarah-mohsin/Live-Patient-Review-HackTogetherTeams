import React from "react";

export default function GameCard() {
  return (
    <div className="gameCard">
      <div className="iconColumn">
        <div className="gameIcon"></div>
      </div>
      <div className="detailsColumn">
        <h6>Game Title</h6>
        <p>Game Description - this game is so fun to play!</p>
        <h6>Max players: 3</h6>
      </div>
    </div>
  );
}
