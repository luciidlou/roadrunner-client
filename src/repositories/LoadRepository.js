import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const LoadRepository = {
    async booked() {
        const res = await fetch(`${Settings.remoteUrl}/loads/booked`, FetchOptions())
        return await res.json()
    }
}