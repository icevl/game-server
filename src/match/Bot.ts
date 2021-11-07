import { Session } from "./Session"
import { IBroadcast } from "@interfaces/match/match.interface"
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

  private loop() {
    // console.log("LOOP here", this.session.npcs)

    this.session.players.forEach(player => {
      if (player.character.is_bot && !player.attackTo) {
        const aliveNPCs = this.session.npcs.filter(npc => npc.config.health > 0)
        if (aliveNPCs.length) {
          const enemy = aliveNPCs[0].name

          // @ts-ignore
          this.broadcast({ type: "bot_attack_start", data: { bot: player.name, enemy: enemy } })
        }
      }
    })

    setTimeout(() => this.loop(), 1000)
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
