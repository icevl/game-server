import DB from "@databases"
import { IMatch } from "@interfaces/matches.interface"

class MatchesService {
  public matches = DB.Matches

  public async findMatch(uuid: string): Promise<IMatch> {
    return await this.matches.findOne({ where: { uuid } })
  }
}

export default MatchesService
