import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const LoadRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/loads`, FetchOptions())
        return await res.json()
    },
    async booked() {
        const res = await fetch(`${Settings.remoteUrl}/loads/booked`, FetchOptions())
        return await res.json()
    },
    async create(obj) {
        const res = await fetch(`${Settings.remoteUrl}/loads`, FetchOptions("POST", obj))
        return await res.json()
    }
}