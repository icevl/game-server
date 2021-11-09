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

  public async stagesCount(mapId: number): Promise<number> {
    const lastStage = await this.spawns.findOne({
      where: { map_id: mapId },
      attributes: ["stage"],
      order: [["stage", "DESC"]],
      raw: true,
      nest: true
    })
    return lastStage["stage"]
  }
}

export default NPCService
