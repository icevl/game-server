import { IEvent, IEventDamage, EventType } from "@/interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"

export class Damage extends MatchEventBase {
  public async call(event: IEvent<IEventDamage>) {
    const npc = this.session.getNPCByName(event.data.character)
    const shooter = this.session.getPlayerByName(event.data.shooter)

    if (npc && shooter) {
      let damage = event.data.damage
      if (npc.currentHealth - damage < 0) damage = npc.currentHealth

      npc.takeDamage(damage)
      shooter.addScore(damage)

      if (npc.currentHealth == 0) {
        this.bot.enemyDead(event.data.character)
      }
    }

    this.session.broadcast({
      type: EventType.Damage,
      data: { character: event.data.character, damage: event.data.damage, damage_type: event.data.damage_type }
    })
  }
}
