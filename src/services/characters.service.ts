import DB from "@databases"
import { ICharacter } from "@interfaces/characters.interface"

class CharactersService {
  public characters = DB.Characters

  public async findUserCharacter(userId: number): Promise<ICharacter> {
    return await this.characters.findOne({ where: { user_id: userId }, raw: true })
  }
}

export default CharactersService
