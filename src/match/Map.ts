import BlocksGroupsService from "@services/maps-blocks-groups.service"
import MatchesService from "@services/matches.service"
import { IMapBlockGroup, IMapBlockResponse } from "@interfaces/match/map.interface"
import { Session } from "./Session"

export class Map {
  private blocksGroupsService = new BlocksGroupsService()
  private matchesService = new MatchesService()
  private session: Session

  constructor(session: Session) {
    this.session = session
  }

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

  public async getGroupPoints(groupId: number): Promise<Array<string>> {
    const points = []

    const groupResponse = await this.blocksGroupsService.findGroup(groupId)
    const groupName = groupResponse.title

    const blocksResponse = await this.blocksGroupsService.findGroupBlocks(groupId)
    const groupSpawnsCount = blocksResponse.reduce((acc, b) => acc + b.capacity, 0)

    let spawnPointIndex = 1

    blocksResponse.forEach(block => {
      Array(block.capacity)
        .fill(Number)
        .map((_, i) => i + 1)
        .forEach((item: number) => {
          points.push(`${groupName}__${block.name}__${spawnPointIndex}__${groupSpawnsCount}`)
          spawnPointIndex += 1
        })
    })

    return points
  }

  public getFreeSpawnPoint(points: Array<string>): string {
    let freePoint = ""
    points
      .sort((a, b) => 0.5 - Math.random())
      .forEach(point => {
        const isFree = this.isSpawnPointFree(point)
        if (isFree && !freePoint) {
          freePoint = point
        }
      })

    return freePoint
  }

  public isSpawnPointFree(spawn: string): boolean {
    return this.session.players.reduce((acc: boolean, item) => (item.spawn === spawn ? false : acc), true)
  }

  public async getSpawnPoint(): Promise<string> {
    if (this.session.map.type === "coop") {
      const points = await this.getGroupPoints(this.session.map.startGroupId)
      return this.getFreeSpawnPoint(points)
    }

    return ""
  }

  public async isAllPlayersReady(): Promise<boolean> {
    let isAllReady = true
    const matchSessions = await this.matchesService.findMatchSessions(this.session.match.id)
    
    matchSessions.forEach(matchSession => {
      if (!matchSession.character.is_bot) {
        const player = this.session.getCharacterPlayer(matchSession.character_id)
        if (!player || !player.isReady) isAllReady = false
      }
    })

    return isAllReady
  }
}
