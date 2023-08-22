import { useEffect, useRef, useState } from "react";
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

export const MainMenu = ({ tabDisplay, setTabDisplay }) => {
  const [people, setPeople] = useState([]);
  const [isAddFeedbackVisible, setIsAddFeedbackVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedbackPatientName, setFeedbackPatientName] = useState("");
  const [clickedKey, setClickedKey] = useState("");
  const [isImageDialogVisible, setIsImageDialogVisible] = useState(false);
  const ALLOWED_ROLES = [UserMeetingRole.organizer, UserMeetingRole.presenter];
  const feedbackRef = useRef();
  const [menuVisible, setMenuVisible] = useState(true);
  const [gameSettingsVisible, setGameSettingsVisible] = useState(false);
  const [selectGame, setSelectGame] = useState("");

  const currentGame = games.filter((game) => game.Title === selectGame)[0];

  const updateScreen = () => {
    setMenuVisible(false);
    setGameSettingsVisible(true);
  };

  const buttonClick = () => {
    console.log("i was clicked");
  };

  const handleChange = () => {
    setTabDisplay((prevTabDisplay) => "Game");
  };

  return (
    <div className="bg">
      <div className="mainScreen">
        <p>{tabDisplay}</p>
        <div className="logo"></div>
        <hr className="line"></hr>
        <div className="appMenu">
          {menuVisible && (
            <div>
              <h2>Choose a game to play</h2>
              {games.map((game) => {
                return (
                  <div className="appMenu">
                    <GameIcon
                      props={updateScreen}
                      gameSelect={setSelectGame}
                      game={game}
                    />
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
                onClick={() => (handleChange(), buttonClick())}
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
