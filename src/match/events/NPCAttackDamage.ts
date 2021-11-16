import { IEvent, IEventNPCAttackDamage, EventType } from "@/interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"

export class NPCAttackDamage extends MatchEventBase {
  public async call(event: IEvent<IEventNPCAttackDamage>) {
    const npc = this.session.getNPCByName(event.data.character)
    const target = this.session.getPlayerByName(event.data.target)
    if (!npc || !target) return

    target.getDamage(20)

    this.session.broadcast({
      type: EventType.CharacterChangeHealth,
      data: { character: target.name, health: target.currentHealth }
    })
  }
}
