import { useEffect, useRef, useState, useContext } from "react";
//import { useLiveCanvas } from "../utils/useLiveCanvas";
// import FluidService from "../services/fluidLiveShare.js";
import { app, meeting } from "@microsoft/teams-js";
import { UserMeetingRole } from "@microsoft/live-share";
// import * as liveShareHooks from "../live-share-hooks/index.js";
import {
  DefaultButton,
  Dialog,
  FontIcon,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import GameCard from "./GameCard.jsx";
import games from "../models/Games.js";
import GameIcon from "./GameIcon.jsx";
import Game from "../game-files/SnakesAndLadders/Game";
import TabDisplayContext from "./TabDisplayContext";

export const MainMenu = () => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [gameSettingsVisible, setGameSettingsVisible] = useState(false);
  const [selectGame, setSelectGame] = useState("");
  const { tabDisplay, setTabDisplay } = useContext(TabDisplayContext);

  const currentGame = games.filter((game) => game.Title === selectGame)[0];

  const showMenu = () => {
    setMenuVisible(false);
    setGameSettingsVisible(true);
  };

  const showGame = () => {
    setMenuVisible(true);
    setGameSettingsVisible(false);
  };

  const buttonClick = () => {
    console.log("i was clicked");
  };

  console.log(tabDisplay);

  return (
    <div>
      <div className="bg"></div>
      <div className="wrapper">
        <div className="container">
          <div className="logo"></div>
          <hr className="line"></hr>
          <br />
          <div>
            {menuVisible && (
              <div className="gameCard">
                {games.map((game) => {
                  return (
                    <GameIcon
                      props={showMenu}
                      game={game}
                      selectGame={setSelectGame}
                    />
                  );
                })}
              </div>
            )}
            {gameSettingsVisible && (
              <>
                <GameCard games={currentGame} showGame={showGame} />
              </>
              // <div>
              //   <div>
              //     <div className="iconColumn">
              //       <div className="gameIcon"></div>
              //       <img
              //         alt="game icon"
              //         className="gameIcon"
              //         src={currentGame.Icon}
              //       />
              //     </div>
              //     <div className="detailsColumn">
              //       <h6>{currentGame.Title}</h6>
              //       <p>{currentGame.Description}</p>
              //       {currentGame.MaxPlayers == "None" ? (
              //         <h6>Players: {currentGame.MinPlayers}+</h6>
              //       ) : (
              //         <h6>
              //           Players: {currentGame.MinPlayers}-
              //           {currentGame.MaxPlayers}
              //         </h6>
              //       )}
              //     </div>
              //     <br />
              //   </div>
              //   <button
              //     className="playButton"
              //     onClick={() => (setTabDisplay("Game"), buttonClick())}
              //   >
              //     Play
              //   </button>
              //   <br />
              //   <br />
              //   <button
              //     onClick={() => {
              //       setGameSettingsVisible(false);
              //       setMenuVisible(true);
              //     }}
              //   >
              //     back
              //   </button>
              // </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
