import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const BidRepository = {
    async loadBids(loadId) {
        const res = await fetch(`${Settings.remoteUrl}/bids/${loadId}/loadbids`, FetchOptions())
        return await res.json()
    },
    async retrieve(id) {
        const res = await fetch(`${Settings.remoteUrl}/bids/${id}`, FetchOptions())
        return await res.json()
    },
    async accept(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/bids/${id}/accept`, FetchOptions("PUT", obj))
        return res
    },
    async delete(id) {
        await fetch(`${Settings.remoteUrl}/bids/${id}`, FetchOptions("DELETE"))
    },
}