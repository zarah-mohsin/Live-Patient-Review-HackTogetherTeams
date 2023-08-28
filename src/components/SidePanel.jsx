import React from "react";
import { useEffect, useState, useContext } from "react";
import { app, FrameContexts } from "@microsoft/teams-js";
import { meeting } from "@microsoft/teams-js";
import { inTeams } from "../utils/inTeams.js";
import { PrimaryButton } from "@fluentui/react";
import TabDisplayContext from "./TabDisplayContext";
import { MainMenu } from "./MainMenu.jsx";

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
  console.log(tabDisplay);

  return (
    <div>
      <MainMenu />
      {/* {tabDisplay === "Might & Malice" && <TurnBasedCombat />}
      {tabDisplay === "Snakes and Ladders" && <Game />} */}
    </div>
  );
};
