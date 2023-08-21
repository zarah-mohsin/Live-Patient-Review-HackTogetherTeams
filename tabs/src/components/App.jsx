import React from "react";
import { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import { SidePanel } from "./SidePanel";
import TabConfig from "./TabConfig";
import { MainMenu } from "./MainMenu";
import "./App.css";
import { FrameContexts, app } from "@microsoft/teams-js";
import Game from "../game-files/SnakesAndLadders/Game";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const [presence, setPresence] = useState(null);

  const initialize = async () => {
    await app.initialize();
    app.notifySuccess();
    const context = await app.getContext();
    if (
      context.page.frameContext === FrameContexts.sidePanel ||
      context.page.frameContext === FrameContexts.meetingStage
    ) {
      setPresence("presence");
    } else {
      setPresence(null);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path={"/"} element={<MainMenu />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/tab" element={<SidePanel />} />
        <Route path="/config" element={<TabConfig />} />
        <Route path="*" element={<Navigate to={"/tab"} />}></Route>
      </Routes>
    </Router>
  );
}
