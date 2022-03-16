import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const EndorsementRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/endorsements`, FetchOptions())
        return await res.json()
    }
}