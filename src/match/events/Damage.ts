import { IEvent, IEventDamage, EventType } from "@/interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"

export class Damage extends MatchEventBase {
  public async call(event: IEvent<IEventDamage>) {
    const npc = this.session.getNPCByName(event.data.character)

    if (npc) {
      npc.config.health -= event.data.damage
    }

    // this.socket.sendToOthers({
    //   type: EventType.Damage,
    //   data: { character: event.data.character, damage: event.data.damage, damage_type: event.data.damage_type }
    // })
  }
}
