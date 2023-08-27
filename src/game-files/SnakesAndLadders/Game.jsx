import React, { useState, useEffect } from "react";
import { SidePanel2 } from "./SidePanel2";
import { app } from "@microsoft/teams-js";
import Snakes3 from "./Snakes3";

const Game = () => {
  const [myName, setMyName] = useState("");

  const [frameContext, setFrameContext] = useState("");

  useEffect(() => {
    async function getContext() {
      try {
        const context = await app.getContext();
        setFrameContext(context.page.frameContext);

        const username = context?.user?.userPrincipalName.split("@")[0];
        setMyName(username);
      } catch (error) {
        // Handle error if any
      }
    }
    getContext();
  }, []);
  console.log(frameContext);

  return (
    <div>
      {/* <p>USERNAME: {myName}</p> */}
      {/* {frameContext == "sidePanel" && <SidePanel users={names} />} */}
      {frameContext == "sidePanel" && <SidePanel2 user={myName} />}
      {frameContext == "meetingStage" && <Snakes3 user={myName} />}
    </div>
  );
};

export default Game;
