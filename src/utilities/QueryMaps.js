export const QueryMaps = (startCity, startState, endCity, endState) => {
    if (!endCity && !endState) {
        return `https://www.google.com/maps/dir/${startCity},+${startState}`
    }
    else {
        return `https://www.google.com/maps/dir/${startCity},+${startState}/${endCity},+${endState}`
    }
}