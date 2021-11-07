import DB from "@databases"
import { ICharacter } from "@interfaces/characters.interface"

class CharactersService {
  public characters = DB.Characters

  public async findCharacterById(characterId: number): Promise<ICharacter> {
    return await this.characters.findByPk(characterId, { raw: true })
  }
}

export default CharactersService
