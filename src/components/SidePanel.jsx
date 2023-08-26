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
import Game from "../game-files/SnakesAndLadders/Game.jsx";
import TurnBasedCombat from "../game-files/Combat/TurnBasedCombat.jsx";

export const SidePanel = () => {
  const [frameContext, setFrameContext] = useState("");
  const { tabDisplay, setTabDisplay } = useContext(TabDisplayContext);

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

  console.log(frameContext);

  return (
    <div>
      {tabDisplay === "Main Menu" && <MainMenu />}
      {tabDisplay === "Game" && <TurnBasedCombat />}
    </div>
  );
};
