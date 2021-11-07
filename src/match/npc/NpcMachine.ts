import { Session } from "../Session"
import { IBroadcast } from "@interfaces/match/match.interface"
import { INPCSpawns } from "@interfaces/match/npc.interface"
import NPCService from "@services/npc.service"
import { NpcSpawner } from "./NpcSpawner"

export class NpcMachine {
  private npcService: NPCService = new NPCService()

  private broadcast: IBroadcast
  private session: Session
  private spawns: INPCSpawns = {}

  constructor(session: Session, broadcast: IBroadcast) {
    this.session = session
    this.broadcast = broadcast
  }

  public start() {
    if (this.session.map.type === "coop") {
      this.waitForBegin()
    }
  }

  private async begin() {
    const mapSpawns = await this.npcService.findMapSpawns(this.session.match.map_id)
    mapSpawns.forEach(spawn => {
      this.session[spawn.id] = new NpcSpawner(this.session, this.broadcast, spawn)
    })
  }

  private waitForBegin() {
    if (!this.session.map.stageStartedAt) {
      setTimeout(() => this.waitForBegin(), 1000)
    } else {
      this.begin()
    }
  }
}
