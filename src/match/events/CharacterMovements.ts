import {
  IEvent,
  EventType,
  IEventCharacterSetDestination,
  IEventCharacterSetRotation,
  IEventShoot
} from "@interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"

export class CharacterMovements extends MatchEventBase {
  public async call(event: IEvent<any>) {
    switch (event.type) {
      case EventType.SetCharacterDestination:
        return this.broadcast(event)

      case EventType.SetCharacterRotation:
        return this.broadcast(event)

      case EventType.SetCharacterAim:
        return this.broadcast(event)

      case EventType.Shoot:
        return this.broadcast(event)

      default:
        return
    }
  }

  private broadcast(event: IEvent<any>) {
    console.log(event)

    const player = this.session.getPlayerByName(event.data.character)
    this.session.sendToOthers(player.character.id, event)
  }
}
