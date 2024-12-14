const config = require('./config.js')

let room_overlay_layer = null
let clicked_room_overlay = null
let highlighted_room_overlay_layer = null

const room_overlay_set_visibility = (map) => {
    if(map.getZoom() < config.room_entity_zoom_cutoff && !map.hasLayer(room_overlay_layer)) {
        if(ENV.DEBUG === true) {
            console.log('Room Overlay: Visible!')
        }
        room_overlay_layer.addTo(map)
    }
    if(map.getZoom() > config.room_entity_zoom_cutoff && map.hasLayer(room_overlay_layer)) {
        if(ENV.DEBUG === true) {
            console.log('Room Overlay: Invisible!')
        }
        room_overlay_layer.remove()
        clicked_room_overlay = null
        highlight_room_overlay(map, clicked_room_overlay)
    }
}

const add_room_overlay_update_event = (map) => {
    map.on('zoomend', (event) => room_overlay_set_visibility(map))
}

const highlight_room_overlay = (map, room_datum) => {
    if(highlighted_room_overlay_layer !== null) {
        highlighted_room_overlay_layer.remove()
    }
    if(room_datum === null) {
        return
    }
    highlighted_room_overlay_layer = L.rectangle(room_datum.coordinates, config.room_overlay_style)
    highlighted_room_overlay_layer.addTo(map)
}

const add_room_overlay_click_event = (map) => {
    map.on('click', (event) => {
        if(map.is_zooming) {
            return
        }
        if(!map.hasLayer(room_overlay_layer)) {
            return
        }
        const previous_clicked_room_overlay = clicked_room_overlay
        clicked_room_overlay = null
        for(const room_datum of window.geojson.room_data) {
            if(L.latLngBounds(room_datum.coordinates).contains(event.latlng)) {
                clicked_room_overlay = room_datum
                if(previous_clicked_room_overlay === room_datum) {
                    location.href = `${config.href}${room_datum.link}`
                    return
                }
            }
        }
        highlight_room_overlay(map, clicked_room_overlay)
    })
}

const setup_room_overlay = (map) => {
    if(room_overlay_layer !== null) {
        room_overlay_layer.remove()
    }
    room_overlay_layer = L.tileLayer(config.room_overlay_url, {
        errorTileUrl: config.room_overlay_error_url,
        noWrap: true,
        minNativeZoom: config.min_native_zoom,
        maxNativeZoom: config.max_native_zoom,
        tileSize: config.image_tile_dimensions,
    })
    add_room_overlay_update_event(map)
    room_overlay_set_visibility(map)
    add_room_overlay_click_event(map)
}


module.exports = {
    setup_room_overlay,
}