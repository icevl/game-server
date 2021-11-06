import DB from "@databases"
import { IMatch } from "@interfaces/matches.interface"
import { IMatchSession } from "@interfaces/matches-sessions.interface"

class MatchesService {
  public matches = DB.Matches
  public matchesSessions = DB.MatchesSessions

  public async findMatch(uuid: string): Promise<IMatch> {
    return await this.matches.findOne({ where: { uuid }, raw: true })
  }

  public async findMatchSessions(matchId: number): Promise<Array<IMatchSession>> {
    return await this.matchesSessions.findAll({
      where: { match_id: matchId },
      include: [
        {
          model: DB.Characters,
          as: "character"
        }
      ],
      raw: true,
      nest: true
    })
  }
}

export default MatchesService
