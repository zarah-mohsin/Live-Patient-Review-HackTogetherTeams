import { useState, useContext, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import FluidService from "../game-files/Combat/fluidLiveShare.js";
import { app, meeting, FrameContexts } from "@microsoft/teams-js";
import "./turnBasedCombat.css";

export default function TurnBasedCombat() {
  const [battleState, setBattleState] = useState();
  const [message, setMessage] = useState(
    "This application only works in a Teams meeting"
  );
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState("");
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [people, setPeople] = useState([]);

  // Create a unity context instance to render the game, as well as establish two way communication between Unity & React
  // sendMessage establishes React -> Unity communication
  // event listeners establish Unity -> React communication
  const { unityProvider, sendMessage, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "build/turn_based_build.loader.js",
      dataUrl: "build/turn_based_build.data",
      frameworkUrl: "build/turn_based_build.framework.js",
      codeUrl: "build/turn_based_build.wasm",
    });

  // Callback function for initialisation
  const giveInitialState = useCallback(() => {
    // Trigger Unity initialisation method to switch to the right battle state
    sendMessage("Battle System", "UnityInit", battleState);
  });

  // Callback function for changing state to Player 1 Attack
  const handlePlayerOneAttackReact = useCallback(async () => {
    try {
      // If it is this player's turn
      const players = await FluidService.getPeopleInfo();
      const context = await app.getContext();
      const user = context?.user?.userPrincipalName.split("@")[0];
      console.log(players);
      console.log("This player's username is: ", user);
      // Only allow interaction if this player is Gladius
      if (user === players["gladius"]) {
        // Update Fluid container battle state to 2 (Player 1 attacking), triggering a change in the Fluid data
        await FluidService.changeBattleState(2);
        console.log("Player 1 is attacking; state moves to PLAYER1ATTACKING");
      } else {
        console.log(people[0]);
        console.log("Not this player's turn.");
      }
    } catch (error) {
      console.log(error);
    }
  });

  const handlePlayerTwoAttackReact = useCallback(async () => {
    try {
      // If it is this player's turn
      const players = await FluidService.getPeopleInfo();
      const context = await app.getContext();
      const user = context?.user?.userPrincipalName.split("@")[0];
      console.log(players);
      console.log("This player's username is: ", user);
      // Only allow interaction if this player is Magilax
      if (user === players["magilax"]) {
        // Update Fluid container battle state to 4 (Player 2 attacking), triggering a change in the Fluid data
        await FluidService.changeBattleState(4);
        console.log("Player 2 is attacking: state moves to PLAYER2ATTACKING");
      } else {
        console.log(people[0]);
        console.log("Not this player's turn.");
      }
    } catch (error) {
      console.log(error);
    }
  });

  const handlePlayerOneTurn = useCallback(async () => {
    try {
      console.log(
        "Heard event: END OF PLAYER 2 ATTACK. Triggering callback to move to player 1 turn."
      );
      // Update FLuid container battle state to 1 (Player 1 turn), triggering a change in the Fluid data
      await FluidService.changeBattleState(1);
      // Switch the order of players
      await FluidService.switchPlayers();
      console.log("Moving to Player 1's turn");
    } catch (error) {
      console.log(error);
    }
  });

  // Function gets triggered after the end of Player 1's Attack, moving the state to Player 2's turn
  const handlePlayerTwoTurn = useCallback(async () => {
    try {
      console.log(
        "Heard event: END OF PLAYER 1 ATTACK. Triggering callback to move to player 2 turn."
      );
      // Update Fluid container battle state to 3 (Player 2 turn), triggering a change in the Fluid data
      await FluidService.changeBattleState(3);
      // Switch the order of players
      await FluidService.switchPlayers();
      console.log("Moving to Player 2's turn");
    } catch (error) {
      console.log(error);
    }
  });

  // Register Unity event listeners
  useEffect(() => {
    addEventListener("GetInitialState", giveInitialState);
    addEventListener("PlayerOneAttackReact", handlePlayerOneAttackReact);
    addEventListener("PlayerTwoAttackReact", handlePlayerTwoAttackReact);
    addEventListener("PlayerTwoTurn", handlePlayerTwoTurn);
    addEventListener("PlayerOneTurn", handlePlayerOneTurn);
    return () => {
      removeEventListener("GetInitialState", giveInitialState);
      removeEventListener("PlayerOneAttackReact", handlePlayerOneAttackReact);
    };
  }, [
    addEventListener,
    removeEventListener,
    giveInitialState,
    handlePlayerOneAttackReact,
  ]);

  // Initialisation logic
  useEffect(() => {
    // Initialise and connect to Fluid container
    app.initialize().then(async () => {
      try {
        const context = await app.getContext();
        const userName = context?.user?.userPrincipalName.split("@")[0];
        setUserName(userName);
        const userId = context?.user?.id;
        setUserID(userId);

        // Store the current context in a useState
        if (context.page.frameContext == FrameContexts.sidePanel) {
          setFrame("Side panel");
          console.log(frame);
          console.log("User is: ", userName, userId);
        } else if (context.page.frameContext == FrameContexts.meetingStage) {
          setFrame("Meeting stage");
          console.log(frame);
        }

        // Check if we're on a side panel or meeting stage
        if (
          context.page.frameContext == FrameContexts.sidePanel ||
          context.page.frameContext == FrameContexts.meetingStage
        ) {
          setReady(true);
        }

        await FluidService.connect();

        const playersObject = await FluidService.getPeopleInfo();
        const playerValues = Object.entries(playersObject).map(
          ([key, value]) => `${key}: ${value}`
        );
        setPeople(playerValues);

        // Get the initial state from the SharedMap and store it in the useState var
        await storeBattleState();

        // Register event handler for any change in Fluid data (e.g. setting a new battle state)
        FluidService.onNewData(async (array) => {
          console.log("Changes made to Fluid container: ", array);
          // After a change to the Fluid container, get and store the new battle state
          if (frame === "Meeting stage") {
            await handleStateChange();
          }
        });

        // Register event handler for any change in people data
        FluidService.onNewPeopleData(async (people) => {
          console.log(
            "Changes made to people list in Fluid container: ",
            people
          );
          await handlePeopleChange();
        });
      } catch (error) {
        console.log(error);
      }
    });
  }, [battleState]);

  async function handlePeopleChange() {
    const newObject = await FluidService.getPeopleInfo();
    console.log(
      "Handle people change got: ",
      newObject,
      "from Fluid container."
    );
    const newValues = Object.entries(newObject).map(
      ([key, value]) => `${key}: ${value}`
    );
    setPeople(newValues);
    console.log("value in people usestate is: ", people);
  }

  async function handleStateChange() {
    const newState = await getBattleStateLS();
    console.log("handleStateChange received ", newState);
    setBattleState(newState);

    console.log("Switch function starting. battleState is: ", newState);
    switch (newState) {
      // Case 1 state: PLAYER1TURN
      case 1:
        console.log("HSC: Battle state is 1, Player 1's Turn");
        if (frame === "Meeting stage") {
          sendMessage("Battle System", "PlayerTurn");
        }
        break;
      // Case 2 state: PLAYER1ATTACKING
      case 2:
        console.log("HSC: Battle state is 2, starting Player 1 Attack");
        if (frame === "Meeting stage") {
          console.log("Frame is meeting stage");
          sendMessage("Battle System", "PlayerOneAttack");
        } else {
          console.log("Frame is not meeting stage");
        }
        break;
      // Case 3 State: PLAYER2TURN
      case 3:
        console.log("HSC: Battle state is 3, Player 2's Turn");
        sendMessage("Battle System", "Player2Turn");
        break;
      // Case 4 State: PLAYER2ATTACKING
      case 4:
        console.log("HSC: Battle state is 4, starting Player 2 attack");
        sendMessage("Battle System", "PlayerTwoAttack");
        break;
      // Case 5 State: PLAYER1WON
      case 5:
        break;
      // Case 6 state: PLAYER2WON
      case 6:
        break;
    }
  }

  // Add this user to the game
  async function addToGame() {
    // Call Fluid function to add this player to the game (assign conditionally to gladius or magilax)
    await FluidService.addPlayer(userName);
  }

  // Remove this player from the game
  async function removeFromGame() {
    // Call Fluid function to remove this player from the game (if they are in it)
    await FluidService.removePlayer(userName);
  }

  // Get the current (int) value of the battle state from the Fluid SharedMap
  async function getBattleStateLS() {
    const gameInfo = await FluidService.getGameInfo();
    console.log(
      "getBattleStateLS got: ",
      gameInfo[0]["battle-state"],
      " from Fluid SharedMap"
    );
    return gameInfo[0]["battle-state"];
  }

  // Get current battle state int from Shared Map & store it in React state
  async function storeBattleState() {
    const stateInt = await getBattleStateLS();
    console.log("storeBattleState received ", stateInt, " from getBattleState");
    setBattleState(stateInt);
  }

  function handleClickStartGame() {
    sendMessage("Battle System", "ReactStart");
  }

  const shareToStage = () => {
    console.log(window.location.origin);
    meeting.shareAppContentToStage((error, result) => {
      if (!error) {
        console.log("Started sharing to stage");
      } else {
        console.warn("shareAppContentToStage failed", error);
      }
    }, window.location.origin + "?inTeams=1&view=stage");
    sendMessage("Battle System", "ReactStart");
  };

  console.log("Ready?", ready);
  console.log("Frame useState value is:", frame);

  if (!ready) {
    return (
      <div className="info">
        <h1>Turn-based Combat</h1>
        <p>{message}</p>
      </div>
    );
  } else {
    if (frame == "Side panel") {
      // Render the side panel
      return (
        <div className="sidePanelTitle">
          <h1>Medieval Mashup</h1>
          <p>Current fighters: </p>
          <div>
            {" "}
            {people.map((name, index) => (
              <div key={index} className="tile">
                {name}
              </div>
            ))}
          </div>
          <button onClick={() => addToGame()}> + Join the fight </button>
          {people.includes(userName) && (
            <button onClick={() => removeFromGame()}>
              {" "}
              - Leave the fight{" "}
            </button>
          )}
          <button onClick={() => shareToStage()}>Start game</button>
        </div>
      );
    } else if (frame == "Meeting stage") {
      // Render the main game
      return (
        <div className="unity-container">
          <button onClick={handleClickStartGame}>Join session</button>
          <Unity
            unityProvider={unityProvider}
            style={{ width: 1000, height: 530 }}
          />
        </div>
      );
    }
  }
}
