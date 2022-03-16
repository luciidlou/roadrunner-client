import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const TrailerTypeRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/trailertypes`, FetchOptions())
        return await res.json()
    }
}