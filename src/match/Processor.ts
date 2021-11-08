import { IEvent, EventType } from "@interfaces/match/match.interface"
import { MatchAuth } from "./events/MatchAuth"
import { MatchMap } from "./events/MatchMap"
import { Damage } from "./events/Damage"
import { MatchEventBase } from "./events/MatchEventBase"

const EVENT_MAPING = {
  [EventType.Connect]: MatchAuth,
  [EventType.SpawnBlocksComplete]: MatchMap,
  [EventType.HoldSpawnPoint]: MatchMap,
  [EventType.Damage]: Damage
}

export class Processor extends MatchEventBase {
  public process(event: IEvent<any>) {
    if (EVENT_MAPING[event.type]) {
      new EVENT_MAPING[event.type](this.socket, this.session, this.bot).call(event)
    }
  }
}
