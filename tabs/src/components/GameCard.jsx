import React from "react";

export default function GameCard({ games }) {
  return (
    <div className="gameCard">
      <div className="iconColumn">
        <div className="gameIcon"></div>
        <img alt="game icon" className="gameIcon" src={games.Icon} />
      </div>
      <div className="detailsColumn">
        <h6>{games.Title}</h6>
        <p>{games.Description}</p>
        <h6>Max players: {games.MaxPlayers}</h6>
        <h6>Min players: {games.MinPlayers}</h6>
      </div>
    </div>
  );
}
