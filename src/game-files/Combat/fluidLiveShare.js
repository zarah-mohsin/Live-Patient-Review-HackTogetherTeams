import { LiveShareClient } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { SharedMap } from "fluid-framework";

class FluidService {

    // Constants
    #GAME_KEY = "game-key";
    #PEOPLE_KEY = "people-key";

    // Service state
    #container;                                                                 // Fluid container
    #gameInfo = [{"battle-state": 1}, {"P1health": 100}, {"P2Health": 100}];    // Initial array of game information
    #people = { "gladius": "unassigned", "magilax": "unassigned" };             // Initial array of people
    #registeredEventHandlers = [];                                              // Array of event handlers
    #registeredPeopleEventHandlers = [];                                        // Array of people event handlers
    #connectPromise;                                                            // Singleton promise

    connect = () => {
        if (!this.#connectPromise) {
            this.#connectPromise = this.#connect();
        }
        return this.#connectPromise
    }

    // Connect to Fluid Relay service
    #connect = async () => {
        try {
            const liveShareHost = LiveShareHost.create();

            const liveShareClient = new LiveShareClient(liveShareHost);
            const { container } = await liveShareClient.joinContainer(
                {
                    initialObjects: { 
                        gameMap: SharedMap, 
                        peopleMap: SharedMap 
                    }
                });

            this.#container = container;

            // Set the initial values in gameMap
            this.#container.initialObjects.gameMap.set(this.#GAME_KEY, JSON.stringify(this.#gameInfo));
            // Set the initial values in peopleMap
            this.#container.initialObjects.peopleMap.set(this.#PEOPLE_KEY, JSON.stringify(this.#people));

            // When Fluid data changes
            this.#container.initialObjects.gameMap.on("valueChanged", async () => {
                // retrieve the updated (Fluid) JSON object at "game-key"
                const json = this.#container.initialObjects.gameMap.get(this.#GAME_KEY);
                this.#gameInfo = JSON.parse(json);
                for (let handler of this.#registeredEventHandlers) {
                    await handler(this.#gameInfo);
                }
            });

            this.#container.initialObjects.peopleMap.on("valueChanged", async () => {
                // retrieve the updated (Fluid) JSON object at "people-key"
                const json = this.#container.initialObjects.peopleMap.get(this.#PEOPLE_KEY);
                // Change the local array
                this.#people = JSON.parse(json);
                // Go through the array of event handlers for a value changed event on the people map, feeding in the new local array
                for (let handler of this.#registeredPeopleEventHandlers) {
                    await handler(this.#people);
                }
            });

        } catch (error) {
            console.log(`Fluid error: ${error.message}`);
            throw (error);
        }
    }

    // Update fluid shared map values based on local values
    #updateFluid = async() => {
        // Get a JSON version of the locally updated object
        const json = JSON.stringify(this.#gameInfo);
        // Update the fluid container with the changed local object
        this.#container.initialObjects.gameMap.set(this.#GAME_KEY, json);
    }

    #updateFluidPeople = async() => {
        // JSONify the local array
        const json = JSON.stringify(this.#people);
        // Push the JSON array to the shared map
        this.#container.initialObjects.peopleMap.set(this.#PEOPLE_KEY, json);
        console.log(this.#container.initialObjects.peopleMap.get('people-key'));
    }

    // Functions used by the game

    changeBattleState = async (battleState) => {
        console.log("Heard call to change battle state within fluidLiveShare");
        // Change the local version of the array to the updated battle state
        this.#gameInfo[0]["battle-state"] = battleState;
        // Update fluid with the changed array
        await this.#updateFluid();
    }

    changeP1Health = async (p1health) => {
        // Change the local version of the array to include the new player 1 health value
        this.#gameInfo[1]["P1Health"] = p1health;
        // Update fluid with the changed array
        await this.#updateFluid();
    }

    changeP2Health = async (p2health) => {
        // Change the local version of the array to include the new player 2 health value
        this.#gameInfo[2]["P2Health"] = p2health;
        // Update fluid with the changed array
        await this.#updateFluid();
    }

    getGameInfo = async () => {
        return this.#gameInfo;
    }

    getPeopleInfo = async () => {
        const json = this.#container.initialObjects.peopleMap.get('people-key');
        const players = JSON.parse(json);
        return players;
    }

    addPlayer = async (player) => {
        // Return the value stored at 'people-key' in peopleMap
        if (this.#container.initialObjects.peopleMap.get('people-key')) {
            const json = this.#container.initialObjects.peopleMap.get('people-key');

            // Parse the JSON object to get that value in a usable format 
            const players = JSON.parse(json);

            // First, check if this player is already in the game
            if ( Object.values(players).includes(player)) {
                // If so, do nothing (this function shouldn't be being called)
                return;
            // If they are not in the game already
            } else {
                // Check what we can do with the player trying to call this function
                if ( players["gladius"] === "unassigned" ) {
                    // If Gladius is unassigned, assign the player to Gladius & update Fluid
                    players["gladius"] = player;
                    this.#people = players;
                    await this.#updateFluidPeople();
                } else if (players["gladius"] !== "unassigned" && players["magilax"] === "unassigned") {
                    // If Gladius is already assigned and Magilax is not, assign the player to Magilax & update Fluid
                    players["magilax"] = player;
                    this.#people = players;
                    await this.#updateFluidPeople();
                    // If both Gladius and Magilax are already assigned, do nothing
                } else if (players["gladius"] !== "unassigned" && players["magilax"] !== "unassigned") {
                    return;
                }
            }
    }}

    removePlayer = async (removedPlayer) => {
        // Get players in the shared map and parse to get the list
        const json = this.#container.initialObjects.peopleMap.get('people-key');
        const players = JSON.parse(json);

        // Iterate through the keys to check if this player is in the game
        for (let key in players) {
            // If they are, change that value back to "unasssigned"
            if (players[key] === removedPlayer) {
                players[key] = "unassigned";
                break;
            }
        }

        // Push the changed object to Fluid
        this.#people = players;
        await this.#updateFluidPeople();
    }

    switchPlayers = async () => {
        // Get players in the shared map and parse to get the list
        const json = this.#container.initialObjects.peopleMap.get('people-key');
        const players = JSON.parse(json);

        let flippedPlayers = {};

        // Might be dodgy, but should create things in the right order
        flippedPlayers["magilax"] = players["magilax"];
        flippedPlayers["gladius"] = players["gladius"];

        this.#people = flippedPlayers;
        await this.#updateFluidPeople();
        
    }

    onNewPeopleData = (e) => {
        this.#registeredPeopleEventHandlers = [e];
    }

    onNewData = (e) => {
        this.#registeredEventHandlers = [e];
    }

}

export default new FluidService();