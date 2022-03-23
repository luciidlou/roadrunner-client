import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const DispatcherRatingRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/ratings`, FetchOptions())
        return await res.json()
    },
    async retrieve(dispatcherId) {
        const res = await fetch(`${Settings.remoteUrl}/ratings/${dispatcherId}`, FetchOptions())
        return await res.json()
    },
    async create(obj) {
        const res = await fetch(`${Settings.remoteUrl}/ratings`, FetchOptions("POST", obj))
        return await res.json()
    },
    async update(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/ratings/${id}`, FetchOptions("PUT", obj))
        return res
    },
    async delete(id) {
        return await fetch(`${Settings.remoteUrl}/ratings/${id}`, FetchOptions("DELETE"))
    },
}