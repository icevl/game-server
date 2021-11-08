import { EventType, IEvent, IEventConnect } from "@/interfaces/match/match.interface"
import BlocksGroupsService from "@services/maps-blocks-groups.service"
import { MatchEventBase } from "./MatchEventBase"

export class MatchAuth extends MatchEventBase {
  private blocksGroupsService = new BlocksGroupsService()
  public async call(event: IEvent<IEventConnect>) {
    if (event.data.match === this.session.match.uuid) {
      const spawnGroup = await this.blocksGroupsService.findGroup(this.session.map.startGroupId)

      await this.session.addCharacter(event.data.character_id, this.socket)
      this.session.setPlayerGroup(event.data.character_id, spawnGroup.title)
      this.socket.sendEvent({ type: EventType.SpawnBlocks, data: this.session.map.blocks })
    }

    this.sendMasterCharacter()
  }

  private async sendMasterCharacter() {
    const masterCharacter = await this.session.getMasterCharacter()
    this.socket.sendEvent({ type: EventType.SetMasterPlayer, data: { character: masterCharacter } })
  }
}
