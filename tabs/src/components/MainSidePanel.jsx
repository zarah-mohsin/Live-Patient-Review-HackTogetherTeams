import React from "react";
import { inTeams } from "../utils/inTeams.js";
import { app, FrameContexts, meeting } from "@microsoft/teams-js";
import { PrimaryButton } from "@fluentui/react";

export default function MainSidePanel({ TabDisplay, setTabDisplay }) {
  // const shareToStage = () => {
  //   if (inTeams()) {
  //     meeting.shareAppContentToStage((error, result) => {
  //       if (!error) {
  //         console.log("Started sharing to stage");
  //       } else {
  //         console.warn("shareAppContentToStage failed", error);
  //       }
  //     }, window.location.origin + "?inTeams=1&view=stage");
  //   }
  // };
  // return (
  //   <div>
  //     <h1>Teams Carnival</h1>
  //     <p>
  //       <PrimaryButton
  //         iconProps={{ iconName: "ShareiOS" }}
  //         onClick={() => shareToStage()}
  //       >
  //         Main Menu
  //       </PrimaryButton>
  //     </p>
  //   </div>
  // );
  return (
    <div>
      <h1>{TabDisplay}</h1>
      <button onClick={() => setTabDisplay("Main Menu")}>Main Menu</button>
    </div>
  );
}
