import { useEffect, useRef, useState, useContext } from "react";
//import { useLiveCanvas } from "../utils/useLiveCanvas";
// import FluidService from "../services/fluidLiveShare.js";
import { app, meeting } from "@microsoft/teams-js";
import "./MainMenu.css";
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

  const updateScreen = () => {
    setMenuVisible(false);
    setGameSettingsVisible(true);
  };

  const buttonClick = () => {
    console.log("i was clicked");
  };

  console.log(tabDisplay);

  return (
    <div className="bg">
      <div className="mainScreen">
        <div className="logo"></div>
        <hr className="line"></hr>
        <div className="appMenu">
          {menuVisible && (
            <div>
              <h2>Choose a game to play</h2>
              {games.map((game) => {
                return (
                  <div className="appMenu">
                    <button
                      className="gameSelect"
                      onClick={() => {
                        updateScreen();
                        setSelectGame(game.Title);
                      }}
                    >
                      {game.Title}
                    </button>
                    <br />
                  </div>
                );
              })}
            </div>
          )}
          {gameSettingsVisible && (
            <div>
              <h2>Choose which participants can play</h2>
              <div className="gameCard">
                <div className="iconColumn">
                  <div className="gameIcon"></div>
                  <img
                    alt="game icon"
                    className="gameIcon"
                    src={currentGame.Icon}
                  />
                </div>
                <div className="detailsColumn">
                  <h6>{currentGame.Title}</h6>
                  <p>{currentGame.Description}</p>
                  {currentGame.MaxPlayers == "None" ? (
                    <h6>Players: {currentGame.MinPlayers}+</h6>
                  ) : (
                    <h6>
                      Players: {currentGame.MinPlayers}-{currentGame.MaxPlayers}
                    </h6>
                  )}
                </div>
                <br />
              </div>
              <button
                className="playButton"
                onClick={() => (setTabDisplay("Game"), buttonClick())}
              >
                Play
              </button>
              <br />
              <br />
              <button
                onClick={() => {
                  setGameSettingsVisible(false);
                  setMenuVisible(true);
                }}
              >
                back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
