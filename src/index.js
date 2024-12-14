const map_dimensions = require('./map_dimensions.js')
const coordinates = require('./coordinates.js')
const config = require('./config.js')
const markers = require('./markers.js')
const highlight = require('./highlight.js')
const bounding_box = require('./bounding_box.js')
const room_overlay = require('./room_overlay.js')
const template = require('./template.js')
const search_bar = require('./search_bar.js')

if(ENV.IMPORT_JSON === true) {
    // Ideally this would be saved in a separate .js file so that the geojson data is easier to modify?
    window.geojson = require('../geojson/index.js')
}

const basemap = L.tileLayer(config.basemap_url, {
    errorTileUrl: config.basemap_error_url,
    noWrap: true,
    minNativeZoom: config.min_native_zoom,
    maxNativeZoom: config.max_native_zoom,
    tileSize: config.image_tile_dimensions,
})
const map = L.map('map', {
    crs: map_dimensions.CRS,
    bounds: map_dimensions.bounds,
    maxBounds: map_dimensions.bounds,
    minZoom: config.min_zoom,
    maxZoom: config.max_zoom,
    layers: [basemap],
    fullscreenControl: true,
    fullScreenControlOptions: {
        position: 'topleft',
    },
    // Set a temporary view that we will immediately overwrite
    center: [config.hopeport_portal_stone_coord_y, config.hopeport_portal_stone_coord_x],
    zoom: config.room_zoom,
    zoomAnimation: true,
})
map.on('zoomstart', function(e) {
    if(ENV.DEBUG === true) {
        console.log('Zoom Start')
    }
    map.is_zooming = true
})
map.on('zoomend', function(e) {
    if(ENV.DEBUG === true) {
        console.log('Zoom End')
    }
    map.is_zooming = false
})
map.is_zooming = false

room_overlay.setup_room_overlay(map)
coordinates.add_coordinates(map)
coordinates.add_tile_hover(map)
markers.setup_entities(map)
highlight.highlight(map, template.type, template.targets, true)
bounding_box.focus_map(map, template.type, template.targets, true)
search_bar.add_search_bar(map)

// Test
if(ENV.DEBUG === true) {
    // TopLeft and BottomRight corners
    L.marker(map_dimensions.bounds.getSouthWest(), {icon: markers.test_marker}).addTo(map).bindPopup(`DEBUG - TopLeft: ${map_dimensions.bounds.getSouthWest()}`)
    L.marker(map_dimensions.bounds.getNorthEast(), {icon: markers.test_marker}).addTo(map).bindPopup(`DEBUG - BottomRight: ${map_dimensions.bounds.getNorthEast()}`)
    // 0, 0
    L.marker([0, 0], {icon: markers.test_marker}).addTo(map).addTo(map).bindPopup(`Zero: ${[0, 0]}`)
    // Hopeport Portal Stone
    const hopeport_portal_stone = [config.hopeport_portal_stone_coord_y, config.hopeport_portal_stone_coord_x]
    L.marker(hopeport_portal_stone, {icon: markers.test_marker}).addTo(map).bindPopup(`DEBUG - Hopeport Portal Stone: ${hopeport_portal_stone}`)
    // Highlight all rooms or episodes (pick one)
    //const highlight = require('./highlight.js')
    //highlight.add_episode(map, 'All')
    //highlight.add_room(map, 'All')
    map.on('zoom', function(e) {
        console.log(`Zoom: ${this.getZoom()}`)
    })
}
