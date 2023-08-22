import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import FluidService from "./fluidLiveShare2.js";
import { app, meeting, FrameContexts } from "@microsoft/teams-js";

export default function Snakes3() {
  //const [message, setMessage] = useState("");
  const [fluidWorks, setFluidWorks] = useState(null);

  const [dice, setDice] = useState(0);

  ///////////////////////////////////////////
  //const [currentPlayer, setCurrentPlayer] = useState(0);
  ///////////////////////////////////////////

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
    //setPlayers(number);
    //FluidService.updateValues(number); //works
    //HERE IT WILL TRIGGER THE EMPTY TRIGEGR METHOD IN FLUID INSTEAD
    FluidService.emptyTrigger();
  }, []);

  useEffect(() => {
    addEventListener("SetPlayersNumber", handlePlayers);
    return () => {
      removeEventListener("SetPlayersNumber", handlePlayers);
    };
  }, [addEventListener, removeEventListener, handlePlayers]);

  /////////////////PASSING DICE VALUE////////////////////////////////

  const passDiceValue = useCallback((number) => {
    setDice(number);
    FluidService.updateValues(number); //works
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
          sendMessage("Dummy", "LoadGame", array[0]);

          setDice(array[0]);
          sendMessage("Dice", "RollFromReact", array[0]);
        });

        //setMessage("Fluid is doing well");
        setFluidWorks(true);
      } catch (error) {
        //setMessage(`ERROR: ${error.message}`);
        setFluidWorks(false);
      }
    });
  }, [sendMessage]);

  return (
    <div>
      {fluidWorks === null && <p>Loading...</p>}
      {fluidWorks === false && (
        <p>
          There is an issue with your connection. Please restart the
          application.
        </p>
      )}
      {fluidWorks === true && (
        <Fragment>
          {/* <p>CURRENT PLAYER: {currentPlayer}</p> */}
          {/* <p>Unity Loaded: {isLoaded.toString()}</p> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Unity unityProvider={unityProvider} style={{ width: "90vw" }} />
          </div>
          {/* <p>Dice: {dice}</p> */}
          {/* <p>Message: {message}</p> */}
        </Fragment>
      )}
    </div>
  );
}
