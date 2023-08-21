import { inTeams } from "../../utils/inTeams.js";
import { meeting, app } from "@microsoft/teams-js";
import { useState, useEffect } from "react";
import FluidService from "./fluidLiveShare2.js";

export const SidePanel2 = ({ user }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [fluidWorks, setFluidWorks] = useState(null);
  const [correctPlayers, setCorrectPlayers] = useState(true);
  const [turn, setTurn] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const myName = user;
  const [playText, setPlayText] = useState("I want to play!");

  const buttonClicked = () => {
    if (!activeUsers.includes(myName)) {
      setActiveUsers((prevActiveUsers) => [...prevActiveUsers, myName]); //do I need this?
      FluidService.updateNames(myName);
      setPlayText("Actually, I changed my mind");
    } else {
      setActiveUsers(activeUsers.filter((elem) => elem !== myName)); //do I need this? I think I do for the rnedring of player list maybe?
      FluidService.removeName(myName);
      setPlayText("I want to play");
    }
  };

  /////////////////////////////////////////////////////

  const shareToStage = () => {
    // if(activeUsers.length > 0 && activeUsers.length <= 4)
    // {
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

  /////////////////////////////////////FLUID///////////////////////////////////////////
  useEffect(() => {
    app.initialize().then(async () => {
      try {
        await FluidService.connect();
        FluidService.resetMap();

        FluidService.onNewData((array) => {
          setActiveUsers(array);

          if (typeof array[0] === "number") {
            if (!gameStarted) {
              setTimeout(() => {
                setGameStarted(true);
              }, 2000);
            }

            if (array[0] !== 6) {
              setTimeout(() => {
                setTurn(`It's your turn, ${array[1]}`);
              }, 2000);
            } else {
              setTimeout(() => {
                setTurn(`Keep rolling, ${array[1]}`);
              }, 2000);
            }
          }
        });

        //setMessage("Fluid is doing well");
        setFluidWorks(true);
      } catch (error) {
        //setMessage(`ERROR: ${error.message}`);
        setFluidWorks(false);
      }
    });
  }, []);

  const startGame = async () => {
    if (activeUsers.length > 0 && activeUsers.length < 5) {
      FluidService.updateValues(activeUsers.length);
      shareToStage();
    } else {
      setCorrectPlayers(false);
      setActiveUsers([]);
      FluidService.resetMap();
    }
  };

  ///////////////STYLING/////////////////////////////

  const panelStyle = {
    textAlign: "center",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100vh",
    alignItems: "center",
  };

  const buttonStyle = {
    marginBottom: "5px",
    padding: "10px",
    backgroundColor: "grey",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%",
    height: "50px",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "green",
  };

  const verticalButtons = {
    display: "flex",
    flexDirection: "column",
  };

  const readyButton = {
    ...buttonStyle,
    backgroundColor: "red",
  };

  return (
    <div style={panelStyle}>
      {fluidWorks === null && <p>Loading...</p>}
      {fluidWorks === false && (
        <p>
          There is an issue with your connection. Please restart the
          application.
        </p>
      )}
      {!correctPlayers && <p>This game requires between 1 and 4 players.</p>}

      {fluidWorks === true && !gameStarted && (
        <div style={verticalButtons}>
          <p>
            Welcome to the treacherousss land of many, many snakes and some
            ladders!
          </p>
          <button
            onClick={buttonClicked}
            style={
              activeUsers.includes(myName) ? buttonStyle : activeButtonStyle
            }
          >
            {playText}
          </button>
          {activeUsers.length > 0 && <p>PLAYERS:</p>}
          {activeUsers.map((name, index) =>
            typeof name === "string" ? <div key={index}>{name}</div> : null
          )}

          <button onClick={startGame} style={readyButton}>
            Everyone ready?
          </button>
        </div>
      )}

      <p>{turn}</p>

      {/* <p>ACTIVE USERS LENGTH: {activeUsers.length}</p>
          {activeUsers.map((name, index) => (
             <div key={index}>{name}</div> 
            ))} */}
      {/* <p>DEBUG LOGS:</p>
        <p>Active users: {activeUsers}</p> */}
      {/* <p>SIDEPANEL MESSAGE: {message}</p> */}
    </div>
  );
};
