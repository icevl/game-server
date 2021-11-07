import DB from "@databases"
import { IMapSpawnNPC } from "@interfaces/maps-spawns-npcs.interface"

class NPCService {
  public spawns = DB.MapsSpawnsNPCs

  public async findMapSpawns(mapId: number): Promise<Array<IMapSpawnNPC>> {
    return await this.spawns.findAll({
      where: { map_id: mapId },
      include: {
        model: DB.NPCs,
        as: "npc"
      },
      raw: true,
      nest: true
    })
  }
}

export default NPCService
