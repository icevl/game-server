import DB from "@databases"
import { MapsBlocksModel } from "@models/maps-blocks.model"
import { IMatch } from "@interfaces/matches.interface"

class BlocksGroupsService {
  public blockGroups = DB.MapsBlocksGroups

  public async findMapGroups(mapId: number): Promise<any> {
    return await this.blockGroups.findAll({
      where: { map_id: mapId },
      attributes: ["title"],
      include: {
        model: DB.MapsBlocks,
        as: "blocks",
        attributes: ["name", "capacity"]
      }
    })
  }
}

export default BlocksGroupsService
