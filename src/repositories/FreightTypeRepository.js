import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const FreightTypeRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/freighttypes`, FetchOptions())
        return await res.json()
    }
}