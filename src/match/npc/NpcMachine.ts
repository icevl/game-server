import dayjs from "dayjs"
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
  private stageSwitcherInterval: NodeJS.Timer

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
      this.spawns[spawn.id] = new NpcSpawner(this.session, this.broadcast, spawn)
    })

    this.stageSwitcherInterval = setInterval(() => this.stageSwitcher(), 5000)
  }

  private stageSwitcher() {
    const isStageSpawsComplete: boolean = Object.keys(this.spawns).reduce((acc, key) => {
      const spawner = this.spawns[key] as NpcSpawner
      if (spawner.spawn.stage === this.session.map.stage && !spawner.isComplete) return false
      return acc
    }, true)

    if (isStageSpawsComplete && !this.session.getLiveNPCs().length) {
      // TODO: switch stage

      if (this.session.map.stage < this.session.map.stagesCount) {
        this.session.map.stage++
        this.session.map.stageStartedAt = dayjs().toDate()
        console.log("New stage:", this.session.map.stage)
      } else {
        console.log("COOP COMPLETE!")
      }
    }
  }

  private waitForBegin() {
    if (!this.session.map.stageStartedAt) {
      setTimeout(() => this.waitForBegin(), 1000)
    } else {
      this.begin()
    }
  }
}
