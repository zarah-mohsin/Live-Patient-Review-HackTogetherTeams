import React from "react";
import { useEffect, useState, useCallback } from "react";
import { app, FrameContexts } from "@microsoft/teams-js";
import "./SidePanel.scss";
import { meeting } from "@microsoft/teams-js";
import { inTeams } from "../utils/inTeams.js";
import { PrimaryButton } from "@fluentui/react";
import { MainMenu } from "./MainMenu";
import MainSidePanel from "./MainSidePanel";

export const SidePanel = ({ tabDisplay, setTabDisplay }) => {
  const [frameContext, setFrameContext] = useState("");

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
  console.log(frameContext);
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
      <h1>Teams Carnival</h1>
      {tabDisplay === "Main Menu" && <p>{tabDisplay}</p>}
      {tabDisplay === "Game" && <p>{tabDisplay}</p>}
      {tabDisplay === "Hello" && (
        <div>
          <p>Hello</p>
          <MainSidePanel
            tabDisplay={tabDisplay}
            setTabDisplay={setTabDisplay}
          />
        </div>
      )}
      {tabDisplay === "Bye" && <p>{tabDisplay}</p>}
      <br />
      <br />
      <p>
        <PrimaryButton onClick={() => shareToStage()}>Main Menu</PrimaryButton>
      </p>
      <button onClick={() => setTabDisplay("Hello")}>Hello</button>
      <button onClick={() => setTabDisplay("Bye")}>Bye</button>
    </div>
  );
  // }
};
