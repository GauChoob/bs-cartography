const config = require('./config.js')
const filter = require('./filter.js')
const markers = require('./markers.js')

let highlighted_episode_layer = null
let highlighted_room_layer = null
let highlighted_entity_layer = null

const highlight_episodes = (map, episodes, exact) => {
    if(highlighted_episode_layer !== null) {
        highlighted_episode_layer.remove()
    }
    highlighted_episode_layer = new L.GeoJSON(window.geojson.episodes.features, {
        filter: filter.get_filter(episodes, true),  // override exact, always true for episode names
        style: config.episode_style,
        interactive: false,
    })
    highlighted_episode_layer.addTo(map)
}

const highlight_rooms = (map, rooms, exact) => {
    if(highlighted_room_layer !== null) {
        highlighted_room_layer.remove()
    }
    highlighted_room_layer = new L.GeoJSON(window.geojson.rooms.features, {
        filter: filter.get_filter(rooms, exact),
        style: config.room_style,
        interactive: false,
    })
    highlighted_room_layer.addTo(map)
}

const highlight_entities = (map, entities, exact) => {
    if(highlighted_entity_layer !== null) {
        highlighted_entity_layer.remove()
    }
    highlighted_entity_layer = new L.GeoJSON(window.geojson.entities.features, {
        filter: filter.get_filter(entities, exact),
        pointToLayer: (feature, latlng) => {
            const size = feature.properties.size
            const coordinates = markers.adjust_coordinates(latlng, size)
            const link = feature.properties.link ? feature.properties.link : feature.properties.name
            return L.marker(coordinates, {icon: config.highlighted_entity_icon, zIndexOffset:config.highlighted_entity_zindex}).bindPopup(`<a class="leaflet-popup-highlighted-entity" href="${config.href}${link}">${feature.properties.name}</a>`)
        }
    })
    highlighted_entity_layer.addTo(map)
}

const highlight_all = (map, targets, exact) => {
    highlight_episodes(map, targets, exact)
    highlight_rooms(map, targets, exact)
    highlight_entities(map, targets, exact)
}

const highlights = {
    'all': highlight_all,
    'episodes': highlight_episodes,
    'rooms': highlight_rooms,
    'entities': highlight_entities,
}
const highlight = (map, type, targets, exact) => highlights[type](map, targets, exact)

module.exports = {
    highlight
}
