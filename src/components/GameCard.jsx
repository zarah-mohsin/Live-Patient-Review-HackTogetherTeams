import React from "react";
import TabDisplayContext from "./TabDisplayContext";

export default function GameCard({ games, showGame }) {
  const { tabDisplay, setTabDisplay } = React.useContext(TabDisplayContext);
  return (
    <div>
      <div className="wrapper">
        <div className="iconColumn">
          <img alt="game icon" className="gameIcon" src={games.Icon} />
        </div>
        <div className="detailsColumn">
          <h6>{games.Title}</h6>
          <p>{games.Description}</p>
          {games.MaxPlayers == "None" ? (
            <h6>Players: {games.MinPlayers}+</h6>
          ) : (
            <h6>
              Players: {games.MinPlayers}-{games.MaxPlayers}
            </h6>
          )}
        </div>
        <br />
      </div>
      <button className="playButton" onClick={() => setTabDisplay("Game")}>
        Play
      </button>
      <br />
      <br />
      <button onClick={showGame}>back</button>
      {/* <div className="gameCard">
        <div className="iconColumn">
          <div className="gameIcon"></div>
          <img alt="game icon" className="gameIcon" src={games.Icon} />
        </div>
        <div className="detailsColumn">
          <h6>{games.Title}</h6>
          <p>{games.Description}</p>
          {games.MaxPlayers == "None" ? (
            <h6>Players: {games.MinPlayers}+</h6>
          ) : (
            <h6>
              Players: {games.MinPlayers}-{games.MaxPlayers}
            </h6>
          )}
        </div>
        <br />
      </div>
      <button className="playButton" onClick={() => handleTabDisplay("Game")}>
        Play
      </button>
      <br /> */}
    </div>
  );
}
