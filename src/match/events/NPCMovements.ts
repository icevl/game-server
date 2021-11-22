import { IEvent, EventType } from "@interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"

export class NPCMovements extends MatchEventBase {
  public async call(event: IEvent<any>) {
    switch (event.type) {
      case EventType.NPCTargetReached:
        return this.targetReached(event)

      default:
        return
    }
  }

  private targetReached(event: IEvent<any>) {
    const npc = this.session.getNPCByName(event.data.character)
    npc.targetReached()
  }
}
