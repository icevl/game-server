import DB from "@databases"
import { MapsBlocksGroupsModel } from "@models/maps-blocks-groups.model"

class BlocksGroupsService {
  public blockGroups = DB.MapsBlocksGroups
  public blocks = DB.MapsBlocks

  public async findGroup(groupId: number): Promise<MapsBlocksGroupsModel> {
    return await this.blockGroups.findByPk(groupId)
  }

  public async findMapGroups(mapId: number): Promise<Array<any>> {
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

  public async findGroupBlocks(groupId: number): Promise<Array<any>> {
    return await this.blocks.findAll({
      where: { group_id: groupId },
      attributes: ["name", "capacity"]
    })
  }
}

export default BlocksGroupsService
