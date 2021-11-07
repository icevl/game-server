import DB from "@databases"
import { IMap } from "@interfaces/maps.interface"

class MapsService {
  public maps = DB.Maps

  public async findMapById(mapId: number): Promise<IMap> {
    return await this.maps.findByPk(mapId, { raw: true })
  }
}

export default MapsService
