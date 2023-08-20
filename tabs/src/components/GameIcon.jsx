import React from "react";

export default function GameIcon({ props, gameSelect, game }) {
  return (
    <div>
      <button
        className="gameSelect"
        onClick={() => {
          props();
          gameSelect(game.Title);
        }}
      >
        {game.Title}
      </button>
    </div>
  );
}
