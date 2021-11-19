import { IEvent, IEventDamage, EventType } from "@interfaces/match/match.interface"
import { MatchEventBase } from "./MatchEventBase"
import { Player } from "../Player"

const HEAL_PERCENT = 20

export class Heal extends MatchEventBase {
  public async call(event: IEvent<IEventDamage>) {
    const character = this.session.getPlayerByName(event.data.character)
    if (this.session.map.type === "coop") this.healCoop(character)
  }

  private healCoop(character: Player) {
    console.log("Heal reqest from character ", character.nick)

    this.session.players.forEach(player => {
      const healAmount = (player.maxHealth * HEAL_PERCENT) / 100
      player.takeHeal(healAmount)

      this.session.broadcast({
        type: EventType.CharacterChangeHealth,
        data: { character: player.name, health: player.currentHealth }
      })
    })
  }
}
