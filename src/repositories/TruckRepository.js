import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const TruckRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/trucks`, FetchOptions())
        return await res.json()
    },
    async retrieve(id) {
        const res = await fetch(`${Settings.remoteUrl}/trucks/${id}`, FetchOptions())
        return await res.json()
    },
    async create(obj) {
        const res = await fetch(`${Settings.remoteUrl}/trucks`, FetchOptions("POST", obj))
        return await res.json()
    },
    async update(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/trucks/${id}`, FetchOptions("PUT", obj))
        return res
    },
    async retire(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/trucks/${id}/retire`, FetchOptions("PUT", obj))
        return res
    }
}