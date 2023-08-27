import React from "react";
import { useEffect, useState, createContext, useContext } from "react";
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
import { FrameContexts, app } from "@microsoft/teams-js";
import TabDisplayContext from "./TabDisplayContext";
import TurnBasedCombat from "../game-files/MightAndMalice/TurnBasedCombat";
import Games from "./Games";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */

export default function App() {
  const [tabDisplay, setTabDisplay] = useState("");

  const initialize = async () => {
    await app.initialize();
    app.notifySuccess();
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <TabDisplayContext.Provider value={{ tabDisplay, setTabDisplay }}>
      <Router>
        <Routes>
          <Route path="/game" element={<Games />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/termsofuse" element={<TermsOfUse />} />
          <Route path="/tab" element={<MainMenu />} />
          <Route path="/config" element={<TabConfig />} />
          <Route path="*" element={<Navigate to={"/game"} />}></Route>
        </Routes>
      </Router>
      //{" "}
    </TabDisplayContext.Provider>
  );
}
