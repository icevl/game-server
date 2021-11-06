import { IEvent, EventType } from "@interfaces/match/match.interface"
import { MatchAuth } from "./events/MatchAuth"
import { MatchMap } from "./events/MatchMap"
import { MatchEventBase } from "./events/MatchEventBase"

const EVENT_MAPING = {
  [EventType.Connect]: MatchAuth,
  [EventType.SpawnBlocksComplete]: MatchMap
}

export class Processor extends MatchEventBase {
  public process(event: IEvent<any>) {
    if (EVENT_MAPING[event.type]) {
      new EVENT_MAPING[event.type](this.socket, this.session).call(event)
    }
  }
}
