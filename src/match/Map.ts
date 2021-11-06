import BlocksGroupsService from "@services/maps-blocks-groups.service"
import { IMapBlockGroup, IMapBlockResponse } from "@interfaces/match/map.interface"

export class Map {
  private blocksGroupsService = new BlocksGroupsService()

  public async getSpawnBlocks(mapId: number): Promise<Array<IMapBlockResponse>> {
    const blockGroups: Array<IMapBlockGroup> = []
    const spawnBlocks = []

    const groupsResponse = await this.blocksGroupsService.findMapGroups(mapId)

    groupsResponse.forEach(group => {
      blockGroups.push({
        group: group.title,
        blocks: group.blocks.map(block => ({ name: block.name, capacity: block.capacity }))
      })
    })

    for (let i = 0; i < blockGroups.length; i += 1) {
      const groupSpawnsCount = blockGroups[i].blocks.reduce((acc, b) => acc + b.capacity, 0)
      const group = { name: blockGroups[i].group, spawns: groupSpawnsCount, blocks: blockGroups[i].blocks }

      let spawnPointIndex = 1

      for (let j = 0; j < group.blocks.length; j += 1) {
        const block = group.blocks[j]
        const spawnBlock = { name: block.name, points: [] }

        for (let c = 0; c < block.capacity; c += 1) {
          const spawnPointName = `${group.name}__${block.name}__${spawnPointIndex}__${groupSpawnsCount}`
          spawnPointIndex += 1
          spawnBlock.points.push(spawnPointName)
        }
        spawnBlocks.push(spawnBlock)
      }
    }

    return spawnBlocks
  }
}