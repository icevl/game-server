import { IEvent, IEventNPCAttackDamage, EventType } from "@/interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"
import { Player } from "../Player"

export class NPCAttackDamage extends MatchEventBase {
  public async call(event: IEvent<IEventNPCAttackDamage>) {
    const npc = this.session.getNPCByName(event.data.character)
    const target = this.session.getPlayerByName(event.data.target)
    if (!npc || !target) return

    target.takeDamage(10)

    this.session.broadcast({
      type: EventType.CharacterChangeHealth,
      data: { character: target.name, health: target.currentHealth }
    })

    if (target.currentHealth <= 0 && this.session.map.type === "coop") {
      this.switchNPCsTarget(target)
    }
  }

  private switchNPCsTarget(player: Player) {
    this.session.npcs
      .filter(npc => npc.attackTarget === player.name)
      .forEach(npc => {
        npc.attackTarget = npc.getEnemy()
        this.session.broadcast({
          type: EventType.NPCAgro,
          data: { character: npc.name, target: npc.attackTarget }
        })
      })
  }
}
