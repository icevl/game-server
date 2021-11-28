import { IEvent, IEventDamage, EventType } from "@interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"
import { Drone } from "../Drone"
import { Player } from "../Player"

export class DroneEvent extends MatchEventBase {
  public async call(event: IEvent<IEventDamage>) {
    const character = this.session.getPlayerByName(event.data.character)
    if (this.session.map.type === "coop") this.droneCoop(character)
  }

  private droneCoop(character: Player) {
    console.log("Drone reqest from character ", character.nick)

    const drone = new Drone(this.session).create(character)
    this.session.addDrone(drone)
  }
}
