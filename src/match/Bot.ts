import { Session } from "./Session"
import MatchesService from "@services/matches.service"
import BlocksGroupsService from "@services/maps-blocks-groups.service"

export class Bot {
  private matchesService = new MatchesService()
  private blocksGroupsService = new BlocksGroupsService()

  private session: Session

  constructor(session: Session) {
    this.session = session
  }

  public async addBots() {
    if (this.session.map.type === "coop") {
      return await this.addCoopBots()
    }
  }

  private async addCoopBots() {
    const sessions = await this.matchesService.findMatchSessions(this.session.match.id)
    const spawnGroup = await this.blocksGroupsService.findGroup(this.session.map.startGroupId)

    sessions
      .filter(session => session.character.is_bot)
      .forEach(async botSession => {
        await this.session.addCharacter(botSession.character_id)
        this.session.setPlayerGroup(botSession.character_id, spawnGroup.title)
      })
  }
}
