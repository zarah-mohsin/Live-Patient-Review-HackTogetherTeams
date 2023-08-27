import React from "react";
import TabDisplayContext from "./TabDisplayContext";
// import Game from "../game-files/SnakesAndLadders/Game";
import TurnBasedCombat from "../game-files/MightAndMalice/TurnBasedCombat";

export default function Games() {
  const { tabDisplay, setTabDisplay } = React.useContext(TabDisplayContext);
  return (
    <div>
      {/* {tabDisplay === "Snakes and Ladders" && <Game />} */}
      {tabDisplay === "Might & Malice" && <TurnBasedCombat />}
    </div>
  );
}
