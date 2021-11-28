import { IEvent, EventType } from "@interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"
import { Drone } from "../Drone"

export class DroneEvent extends MatchEventBase {
  public async call(event: IEvent<any>) {
    switch (event.type) {
      case EventType.CharacterDroneRequest:
        this.droneCoop(event)
        break

      default:
        return
    }
  }

  private droneCoop(event) {
    if (this.session.map.type !== "coop") return
    const character = this.session.getPlayerByName(event.data.character)

    if (character.droneCount > 0) {
      const characterHasActiveDrones =
        this.session.drones.filter(drone => drone.character.name === character.name).length > 0

      if (characterHasActiveDrones) return

      const drone = new Drone(this.session).create(character)
      this.session.addDrone(drone)
      
      character.droneCount -= 1
      this.socket.sendEvent({ type: EventType.DroneSpawnSuccess, data: { character: event.data.character } })
    }
  }
}
