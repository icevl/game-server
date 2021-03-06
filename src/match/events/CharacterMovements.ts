import { IEvent, EventType } from "@interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"

export class CharacterMovements extends MatchEventBase {
  public async call(event: IEvent<any>) {
    switch (event.type) {
      case EventType.SetCharacterDestination:
      case EventType.SetCharacterPosition:
      case EventType.SetCharacterRotation:
      case EventType.SetCharacterAim:
      case EventType.EquipWeapon:
      case EventType.ReloadingStart:
      case EventType.ShootStart:
      case EventType.ShootStop:
      case EventType.CharacterSit:
      case EventType.Shoot:
        return this.broadcast(event)

      default:
        return
    }
  }

  private broadcast(event: IEvent<any>) {
    const player = this.session.getPlayerByName(event.data.character)

    if (event.data.position) {
      player.position = event.data.position
    }

    this.session.sendToOthers(player.character.id, event)
  }
}
