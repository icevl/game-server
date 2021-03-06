import { IEvent, EventType } from "@interfaces/match/match.interface"
import { MatchAuth } from "./events/MatchAuth"
import { Pong } from "./events/Pong"
import { MatchMap } from "./events/MatchMap"
import { Damage } from "./events/Damage"
import { CharacterMovements } from "./events/CharacterMovements"
import { NPCMovements } from "./events/NPCMovements"
import { MatchEventBase } from "./events/MatchEventBase"
import { NPCAttackDamage } from "./events/NPCAttackDamage"
import { Heal } from "./events/Heal"
import { DroneEvent } from "./events/Drone"

const EVENT_MAPING = {
  [EventType.Connect]: MatchAuth,
  [EventType.Pong]: Pong,
  [EventType.SpawnBlocksComplete]: MatchMap,
  [EventType.HoldSpawnPoint]: MatchMap,
  [EventType.Damage]: Damage,
  [EventType.NPCAttackDamage]: NPCAttackDamage,
  [EventType.SetCharacterDestination]: CharacterMovements,
  [EventType.SetCharacterRotation]: CharacterMovements,
  [EventType.SetCharacterAim]: CharacterMovements,
  [EventType.EquipWeapon]: CharacterMovements,
  [EventType.ReloadingStart]: CharacterMovements,
  [EventType.ShootStart]: CharacterMovements,
  [EventType.ShootStop]: CharacterMovements,
  [EventType.Shoot]: CharacterMovements,
  [EventType.CharacterSit]: CharacterMovements,
  [EventType.CharacterHealRequest]: Heal,
  [EventType.CharacterDroneRequest]: DroneEvent,
  [EventType.NPCTargetReached]: NPCMovements
}

export class Processor extends MatchEventBase {
  public process(event: IEvent<any>) {
    if (EVENT_MAPING[event.type]) {
      new EVENT_MAPING[event.type](this.socket, this.session, this.bot).call(event)
    }
  }
}
