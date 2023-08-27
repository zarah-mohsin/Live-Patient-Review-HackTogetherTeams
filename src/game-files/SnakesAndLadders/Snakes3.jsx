import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import FluidService from "./fluidLiveShare2";
import { app } from "@microsoft/teams-js";
import "./snakes.css";

export default function Snakes3({ user }) {
  const myName = user;

  const [fluidWorks, setFluidWorks] = useState(null);

  const [dice, setDice] = useState(0);

  //////////////////////////////////////////////////////////////
  const [movementCount, setMovementCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  //////////////////////////////////////////////////////////////

  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    sendMessage,
    isLoaded,
  } = useUnityContext({
    loaderUrl: "build/SnakesAndLadders/build3.loader.js",
    dataUrl: "build/SnakesAndLadders/build3.data",
    frameworkUrl: "build/SnakesAndLadders/build3.framework.js",
    codeUrl: "build/SnakesAndLadders/build3.wasm",
  });

  //////////////LETS ROLL BUTTON TRIGGER///////////////////////

  const handlePlayers = useCallback((number) => {
    FluidService.emptyTrigger();
  }, []);

  useEffect(() => {
    addEventListener("SetPlayersNumber", handlePlayers);
    return () => {
      removeEventListener("SetPlayersNumber", handlePlayers);
    };
  }, [addEventListener, removeEventListener, handlePlayers]);

  /////////////////PASSING DICE VALUE////////////////////////////////

  const passDiceValue = useCallback(async (number) => {
    //add the the movementCount
    setMovementCount((prevCount) => prevCount + 1);

    const fluidArray = await FluidService.getValues();
    if (fluidArray[1] === myName) {
      //If this condition is true, it means it is our turn to move so we will allow for the dice to be rolled.
      setDice(number);
      FluidService.updateValues(number); //works
    }
  }, []);

  useEffect(() => {
    addEventListener("PassDiceValue", passDiceValue);
    return () => {
      removeEventListener("PassDiceValue", passDiceValue);
    };
  }, [addEventListener, removeEventListener, passDiceValue]);

  /////////////////////////////////////FLUID///////////////////////////////////////////
  useEffect(() => {
    app.initialize().then(async () => {
      try {
        await FluidService.connect();

        FluidService.onNewData((array) => {
          if (array[0] === -1) {
            setGameOver(true);
          } else {
            sendMessage("Dummy", "LoadGame", array[0]);

            setDice(array[0]);
            sendMessage("Dice", "RollFromReact", array[0]);
          }
        });

        //setMessage("Fluid is doing well");
        setFluidWorks(true);
      } catch (error) {
        //setMessage(`ERROR: ${error.message}`);
        setFluidWorks(false);
      }
    });
  }, [sendMessage]);

  const endGame = () => {
    setGameOver(true);
  };

  //DOWNLOAD DATA:
  //I need to figure out a way to add state vars to the fS when the game comes to an end

  return (
    <div>
      {fluidWorks === null && <p>Loading...</p>}
      {fluidWorks === false && (
        <p>
          There is an issue with your connection. Please restart the
          application.
        </p>
      )}
      {fluidWorks === true && !gameOver && (
        <Fragment>
          {/* <p>CURRENT PLAYER: {currentPlayer}</p> */}
          {/* <p>Unity Loaded: {isLoaded.toString()}</p> */}
          <p>MOVEMENT COUNT: {movementCount}</p>
          <div className="unity-container">
            <Unity unityProvider={unityProvider} style={{ width: "90vw" }} />
          </div>
          {/* <p>Dice: {dice}</p> */}
          {/* <p>Message: {message}</p> */}

          {/* <button onClick={endGame}>End Game</button> */}
        </Fragment>
      )}
      {gameOver && <button>Download Data</button>}
    </div>
  );
}
