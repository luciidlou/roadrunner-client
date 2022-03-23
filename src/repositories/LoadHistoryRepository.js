import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const LoadHistoryRepository = {
    async retrieve(loadId) {
        const res = await fetch(`${Settings.remoteUrl}/loadhistory/${loadId}`, FetchOptions())
        return await res.json()
    },
    async create(obj) {
        const res = await fetch(`${Settings.remoteUrl}/loadhistory`, FetchOptions("POST", obj))
        return await res.json()
    }
}