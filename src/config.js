/* Base Image Properties */
// Cache buster: Needs to be changed every time that the map tiles are updated
const cache_buster = '41207'
// Image dimensions in pixels
const image_width = 26800
const image_height = 14400
// Image dimensions of a single image tile generated by vips
const image_tile_dimensions = 256
// Width or height of one game tile (64 in the cache)
const tile_width = 48
// Pixel of the Hopeport Portal Stone in the image
const hopeport_portal_stone_image_x = 4537
const hopeport_portal_stone_image_y = 3432
// Min and max zoom level at which tiles are rendered
const min_native_zoom = 0
const max_native_zoom = 7

/* Map Properties */
// Desired map coordinate of the Hopeport Portal Stone
const hopeport_portal_stone_coord_x = 94
const hopeport_portal_stone_coord_y = 71
// Tile layer url
const basemap_url = `https://brightershoreswiki.org/images/Brighter_Shores_World_Map_Tile_{z}_{y}_{x}.png?${cache_buster}`
const basemap_error_url = `https://brightershoreswiki.org/images/Brighter_Shores_World_Map_Tile_blank.png?${cache_buster}`
const room_overlay_url = `https://brightershoreswiki.org/images/Brighter_Shores_World_Map_Overlay_{z}_{y}_{x}.png?${cache_buster}`
const room_overlay_error_url = `https://brightershoreswiki.org/images/Brighter_Shores_World_Map_Overlay_blank.png?${cache_buster}`
// When to switch between Room data and Entity data
const room_entity_zoom_cutoff = 6.5
// Min and max zoom of the map
const min_zoom = 0
const max_zoom = 8

/* Tile Hover */
const tile_hover_style = {
    color: 'red',
    weight: 1,
}

/* Room and Episode */
const room_colors = {
    'Hopeport': 'yellow',
    'Hopeforest': 'green',
    'Mine of Mantuban': 'blue',
    'Crenopolis': 'gray',
    'unknown': 'black',
}
const room_style = (feature) => ({
    color: room_colors[feature.properties.episode || 'unknown'],
    weight: 3,
    opacity: 1,
    fill: true,
    fillColor: room_colors[feature.properties.episode || 'unknown'],
    fillOpacity: 0.2,
})
const room_overlay_style = {
    color: 'black',
    weight: 3,
    opacity: 1,
    fill: true,
    fillColor: 'black',
    fillOpacity: 0.2,
}
const episode_style = (feature) => ({
    color: room_colors[feature.properties.name || 'unknown'],
    weight: 3,
    opacity: 1,
    fill: true,
    fillColor: room_colors[feature.properties.name || 'unknown'],
    fillOpacity: 0.2,
})
// Room default zoom on page load
const room_zoom = 5

/* Entities */
// Minimum size of entities even when you zoom out a lot
const entity_minimum_width = 6
// Marker to highlight selected entities:
const highlighted_entity_icon = L.icon({
    iconUrl: `https://brightershoreswiki.org/images/Brighter_Shores_World_Map_Marker.png?${cache_buster}`,
    //iconRetinaUrl: '',
    //shadowUrl: 'marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    //shadowSize: [41, 41],
    className: 'leaflet-marker-icon-highlighted-entity'
})
// How many extra tiles to display around the highlighted selected entries
const highlighted_entity_margin = 5
// Want 1/12 of a tile gap on all sides of an entity
const entity_padding = 1/12

/* Misc */
const href = 'https://brightershoreswiki.org/w/'
// Only show search results for text with at least x characters
const minimum_characters_in_automatic_search = 3
// Large box around the entire world - should not be visible
const world_dimension = 100000
const world_dimensions = [[-world_dimension, -world_dimension], [-world_dimension, world_dimension], [world_dimension, world_dimension], [world_dimension, -world_dimension]]

module.exports = {
    image_width,
    image_height,
    image_tile_dimensions,
    tile_width,
    hopeport_portal_stone_image_x,
    hopeport_portal_stone_image_y,
    min_zoom,
    max_zoom,
    min_native_zoom,
    max_native_zoom,
    hopeport_portal_stone_coord_x,
    hopeport_portal_stone_coord_y,
    basemap_url,
    basemap_error_url,
    room_overlay_url,
    room_overlay_error_url,
    room_entity_zoom_cutoff,
    tile_hover_style,
    room_style,
    room_overlay_style,
    episode_style,
    room_zoom,
    entity_minimum_width,
    highlighted_entity_icon,
    highlighted_entity_margin,
    entity_padding,
    href,
    minimum_characters_in_automatic_search,
    world_dimensions,
}