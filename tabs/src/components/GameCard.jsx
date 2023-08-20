import React from "react";

export default function GameCard({ games }) {
  const icon = games.Icon;
  console.log(icon);
  return (
    <div className="gameCard">
      <div className="iconColumn">
        <div className="gameIcon"></div>
        <img src={require(games.Icon)} alt="game icon" className="gameIcon" />
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
