import { Session } from "./Session"
import { IBroadcast, EventType } from "@interfaces/match/match.interface"
import MatchesService from "@services/matches.service"
import BlocksGroupsService from "@services/maps-blocks-groups.service"

export class Bot {
  private matchesService = new MatchesService()
  private blocksGroupsService = new BlocksGroupsService()

  private session: Session
  private broadcast: IBroadcast

  constructor(session: Session, broadcast: IBroadcast) {
    this.session = session
    this.broadcast = broadcast
  }

  public async addBots() {
    if (this.session.map.type === "coop") {
      this.loop()
      return await this.addCoopBots()
    }
  }

  public enemyDead(enemyCharacter: string) {
    this.releaseEnemyAttackers(enemyCharacter)
    this.agro()
    this.checkIdleBots()
  }

  private get bots() {
    return this.session.players.filter(player => player.character.is_bot)
  }

  private releaseEnemyAttackers(character: string) {
    this.bots.forEach(bot => {
      if (bot.attackTo === character) {
        bot.attackTo = null
      }
    })
  }

  private loop() {
    this.agro()

    setTimeout(() => this.loop(), 1000)
  }

  private agro() {
    this.bots.forEach(bot => {
      if (!bot.attackTo) {
        const aliveNPCs = this.session.npcs.filter(npc => npc.currentHealth > 0)
        if (aliveNPCs.length) {
          const enemy = aliveNPCs[0].name
          bot.attackTo = enemy

          this.broadcast({ type: EventType.BotAttackStart, data: { bot: bot.name, enemy: enemy } })
        }
      } else {
        const npc = this.session.getNPCByName(bot.attackTo)
        if (npc && npc.currentHealth <= 0) bot.attackTo = this.getRandomEnemy()
      }
    })
  }

  private getRandomEnemy(): string {
    const aliveNPCs = this.session.npcs.filter(npc => npc.currentHealth > 0)
    if (aliveNPCs.length) {
      return aliveNPCs[0].name
    }

    return ""
  }

  private checkIdleBots() {
    this.bots.forEach(bot => {
      if (!bot.attackTo) {
        this.broadcast({ type: EventType.BotAttackStop, data: { bot: bot.name } })
      }
    })
  }

  private async addCoopBots() {
    const sessions = await this.matchesService.findMatchSessions(this.session.match.id)
    const spawnGroup = await this.blocksGroupsService.findGroup(this.session.map.startGroupId)

    sessions
      .filter(session => session.character.is_bot)
      .forEach(async botSession => {
        await this.session.addCharacter(botSession.character_id)
        this.session.setPlayerGroup(botSession.character_id, spawnGroup.title)
        this.session.setPlayerReady(botSession.character_id, true)
      })
  }
}
