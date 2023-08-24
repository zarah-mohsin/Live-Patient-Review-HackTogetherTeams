import React from "react";
import { useEffect, useState, useContext } from "react";
import { app, FrameContexts } from "@microsoft/teams-js";
import { meeting } from "@microsoft/teams-js";
import { inTeams } from "../utils/inTeams.js";
import { PrimaryButton } from "@fluentui/react";
import TabDisplayContext from "./TabDisplayContext";
import games from "../models/Games.js";
import "./MainMenu.css";
// import "./SidePanel.scss";

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

  useEffect(() => {
    console.log("state changed");
  }, [tabDisplay]);

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

  console.log(tabDisplay);
  console.log(selectGame);
  // We're ready; render the whole UI
  // if (frameContext === FrameContexts.meetingStage) {
  //   return (
  //     <div>
  //       <MainMenu tabDisplay={tabDisplay} handleTabDisplay={setTabDisplay} />
  //     </div>
  //   );
  // } else {
  return (
    <div>
      {tabDisplay === "Main Menu" && (
        <div>
          <div className="bg"></div>
          <div className="wrapper">
            <div className="container">
              <div className="logo"></div>
              <br />
              <div className="gameCard">
                {games.map((game) => {
                  return (
                    <div>
                      <button
                        className="gameSelect"
                        onClick={() => {
                          setSelectGame(game.Title);
                        }}
                      >
                        {game.Title}
                      </button>
                      <br />
                    </div>
                  );
                })}
                hello
              </div>
              <br />
              <p>
                <PrimaryButton onClick={() => shareToStage()}>
                  Main Menu
                </PrimaryButton>
              </p>
              <br />
              <button onClick={() => setTabDisplay("Hello")}>Hello</button>
              <br />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
