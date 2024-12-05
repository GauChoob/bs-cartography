
const config = require('./config.js')

let entity_layer = null
let highlighted_entity_layer = null


const adjust_coordinates = (latlng, size) => [latlng.lat + size[1]/2, latlng.lng + size[0]/2]

const highlight_entities = (map, entity, exact) => {
    if(highlighted_entity_layer !== null) {
        highlighted_entity_layer.remove()
    }
    const filter_exact = (feature, layer) => feature.properties.name === entity || entity === 'All'
    const filter_inexact = (feature, layer) => feature.properties.name.toLowerCase().includes(entity.toLowerCase()) || entity === 'All'
    highlighted_entity_layer = new L.GeoJSON(window.geojson.entities.features, {
        filter: exact ? filter_exact : filter_inexact,
        pointToLayer: (feature, latlng) => {
            const size = feature.properties.size
            const coordinates = adjust_coordinates(latlng, size)
            return L.marker(coordinates, {icon: config.highlighted_entity_icon}).bindPopup(`<a class="leaflet-popup-highlighted-entity" href="${config.href}${feature.properties.name}">${feature.properties.name}</a>`)
        }
    })
    highlighted_entity_layer.addTo(map)
}


const EntityMarker = L.Marker.extend({
    update_size() {
        const tile_width = this.entity_map.latLngToLayerPoint([0,1]).x - this.entity_map.latLngToLayerPoint([0,0]).x
        const icon = this.getIcon()
        icon.options.iconSize = [Math.max(config.entity_minimum_width, tile_width*this.entity_size[0]), Math.max(config.entity_minimum_width, tile_width*this.entity_size[1])]
        this.setIcon(icon)
    },
})

const add_entities = (map) => {
    if(entity_layer !== null) {
        entity_layer.remove()
    }
    const create_entity = (feature, latlng) => {
        const icon = L.divIcon({className: 'leaflet-marker-icon-entity ' + feature.properties.classes.map(classname => `leaflet-marker-icon-${classname}`).join(' ')})
        const size = feature.properties.size
        const coordinates = adjust_coordinates(latlng, size)
        const marker = new EntityMarker(coordinates, {icon})
        marker.entity_size = size
        marker.entity_map = map
        marker.update_size()
        if(ENV.DEBUG === true) {
            marker.bindPopup(`<a class="leaflet-popup-entity" href="${config.href}${feature.properties.name}">${feature.properties.name}</a> ${feature.properties.classes.map(classname => `leaflet-marker-icon-${classname}`).join(' ')}`)
        }
        if(ENV.DEBUG === false) {
            marker.bindPopup(`<a class="leaflet-popup-entity" href="${config.href}${feature.properties.name}">${feature.properties.name}</a>`)
        }
        return marker
    }
    entity_layer = new L.GeoJSON(window.geojson.entities.features, {
        pointToLayer: create_entity,
    })
}

const entities_set_visibility = (map) => {
    if(map.getZoom() > config.room_entity_zoom_cutoff && !map.hasLayer(entity_layer)) {
        if(ENV.DEBUG === true){
            console.log('Entity Overlay: Visible!')
        }
        entity_layer.addTo(map)
    }
    if(map.getZoom() < config.room_entity_zoom_cutoff && map.hasLayer(entity_layer)) {
        if(ENV.DEBUG === true){
            console.log('Entity Overlay: Invisible!')
        }
        entity_layer.remove()
    }
}
const add_entities_update_event = (map) => {
    map.on('zoomend', (event) => {
        entities_set_visibility(map)
        map.eachLayer((layer) => {
            if(!(layer instanceof EntityMarker)) {
                return
            }
            layer.update_size()
        })
    })
}

const setup_entities = (map) => {
    add_entities(map)
    add_entities_update_event(map)
    entities_set_visibility(map)
}
module.exports = {
    setup_entities,
    highlight_entities,
}

if(ENV.DEBUG === true){
    module.exports.test_marker = L.icon({
        iconUrl: 'https://brightershoreswiki.org/images/Hopeport_episode_icon.png?8f107',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    })
}