import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const TruckRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/trucks`, FetchOptions())
        return await res.json()
    }
}