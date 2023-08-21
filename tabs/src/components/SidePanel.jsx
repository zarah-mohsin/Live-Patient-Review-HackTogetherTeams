import React from "react";
import { useEffect, useState, useCallback } from "react";
import { app, FrameContexts } from "@microsoft/teams-js";
import { UserMeetingRole } from "@microsoft/live-share";
import "./SidePanel.scss";
// import FluidService from "../services/fluidLiveShare.js";
import { meeting } from "@microsoft/teams-js";
import { inTeams } from "../utils/inTeams.js";
// import * as liveShareHooks from "../live-share-hooks";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { FontIcon, PrimaryButton } from "@fluentui/react";
//import { Reorder } from "framer-motion";
import { Draggable } from "react-drag-reorder";
// import fluidLiveShare from "../services/fluidLiveShare.js";

//class WhosNextTab extends React.Component {
export const SidePanel = () => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     ready: false,
  //     message: "Connecting to Fluid service...",
  //     userName: "",
  //     addedName: "",
  //     people: [],
  //   };
  //   this.inputChange = this.inputChange.bind(this);
  //   this.keyDown = this.keyDown.bind(this);
  // }

  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Connecting to Fluid service...");
  const [userName, setUserName] = useState("");
  const [addedName, setAddedName] = useState("");
  const [people, setPeople] = useState([]);
  const [tabDisplay, setTabDisplay] = useState("Main Menu");
  const ALLOWED_ROLES = [UserMeetingRole.organizer];

  const initialize = async () => {
    app.initialize().then(async () => {
      try {
        const context = await app.getContext();
        const userName = context?.user?.userPrincipalName.split("@")[0];

        // Ensure we're running in a side panel
        if (context.page.frameContext !== FrameContexts.sidePanel) {
          // setReady(false);
          setMessage(
            "This tab only works in the side panel of a Teams meeting. Please join the meeting to use it."
          );
          return;
        }

        // // Attempt to connect to the Fluid relay service
        // await FluidService.connect();
        // const people = await FluidService.getPersonList();
        // setReady(true);
        // setMessage("");
        // setUserName(userName);
        // setPeople(people.people);

        // // Register an event handler to update state when fluid data changes
        // FluidService.onNewData((people) => {
        //   setReady(true);
        //   setPeople(null);
        //   setPeople(people.people);
        //   setMessage("");
        // });

        initializeIcons();
      } catch (error) {
        // Display any errors encountered while connecting to Fluid service
        setReady(false);
        setMessage(`ERROR: ${error.message}`);
      }
    });
  };

  useEffect(() => {
    initialize();
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

  // We're ready; render the whole UI
  return (
    <div>
      <h1>Teams Carnival</h1>
      {tabDisplay === "Main Menu" && (
        <>
          <br />
        </>
      )}
      <p>
        <PrimaryButton
          iconProps={{ iconName: "ShareiOS" }}
          onClick={() => shareToStage()}
        >
          Main Menu
        </PrimaryButton>
      </p>
    </div>
  );
};
