import React from "react";

export default function GameIcon({ props, selectGame, game }) {
  return (
    <div>
      <button
        className="gameSelect"
        onClick={() => {
          props();
          selectGame(game.Title);
        }}
      >
        <img alt="game icon" src={game.Icon} />
      </button>
      <p>{game.Title}</p>
    </div>
  );
}
