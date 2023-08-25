import React from "react";
import { useEffect, useState, useContext } from "react";
import { app, FrameContexts } from "@microsoft/teams-js";
import { meeting } from "@microsoft/teams-js";
import { inTeams } from "../utils/inTeams.js";
import { PrimaryButton } from "@fluentui/react";
import TabDisplayContext from "./TabDisplayContext";
import games from "../models/Games.js";
import "./SidePanel.css";
import GameIcon from "./GameIcon.jsx";
import { MainMenu } from "./MainMenu.jsx";

export const SidePanel = () => {
  const [frameContext, setFrameContext] = useState("");
  const { tabDisplay, setTabDisplay } = useContext(TabDisplayContext);
  const [selectGame, setSelectGame] = useState("");

  useEffect(() => {
    async function getContext() {
      try {
        const context = await app.getContext();
        setFrameContext(context.page.frameContext);

        //////////////////////////////////////////

        ////////////////////////////////////////////
      } catch (error) {
        // Handle error if any
      }
    }
    getContext();
  }, []);

  const shareToStage = () => {
    if (inTeams()) {
      meeting.shareAppContentToStage((error, result) => {
        if (!error) {
          console.log("Started sharing to stage");
        } else {
          console.warn("shareAppContentToStage failed", error);
        }
      }, window.location.origin + "?inTeams=1&view=stage");
    }
  };

  console.log(selectGame);

  return (
    <div>
      {tabDisplay === "Main Menu" && (
        <div>
          {/* <div className="bg"></div>
          <div className="wrapper">
            <div className="container">
              <div className="logo"></div>
              <hr className="line"></hr>
              <br />
              <div className="gameCard">
                {games.map((game) => {
                  return <GameIcon game={game} selectGame={setSelectGame} />;
                })}
              </div>
              <br />
              <br />
            </div>
          </div> */}
          <MainMenu />
        </div>
      )}
    </div>
  );
};
