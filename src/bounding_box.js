const config = require('./config.js')
const filter = require('./filter.js')

const update_bounds = (bbox, point) => {
    // bounds is [[y, x], [y, x]]
    // point is [x, y]
    bbox[0][1] = Math.min(bbox[0][1], point[0]) // x min
    bbox[1][1] = Math.max(bbox[1][1], point[0]) // x max
    bbox[0][0] = Math.min(bbox[0][0], point[1]) // y min
    bbox[1][0] = Math.max(bbox[1][0], point[1]) // y max
}

const get_bounding_box = (features) => {
    const bounds = [[Infinity, Infinity], [-Infinity, -Infinity]]
    for(const feature of features) {
        if(feature.geometry.type === 'Polygon') {
            for(const point of feature.geometry.coordinates[0]) {
                update_bounds(bounds, point)
            }
        } else { // 'Point'
            update_bounds(bounds, feature.geometry.coordinates)
        }
    }
    return bounds
}

const get_middle_of_bounding_box = (bbox) => [
    (bbox[0][0] + bbox[1][0])/2,
    (bbox[0][1] + bbox[1][1])/2
]

const focus_map = (map, type, targets, exact) => {
    let features = []
    if(type === 'all') {
        for(const key of ['episodes', 'rooms', 'entities']) {
            features = features.concat(window.geojson[key].features.filter(filter.get_filter(targets, exact)))
        }
    } else {
        features = window.geojson[type].features.filter(filter.get_filter(targets, exact))
    }
    if(features.length === 0) {
        return
    }
    const bbox = get_bounding_box(features)
    if(type === 'episodes') {
        map.fitBounds(bbox)
    }
    if(type === 'rooms') {
        // In case if there are multiple rooms
        if (targets.length > 1) {
            bbox[0][0] -= config.highlighted_entity_margin
            bbox[0][1] -= config.highlighted_entity_margin
            bbox[1][0] += config.highlighted_entity_margin
            bbox[1][1] += config.highlighted_entity_margin
            map.fitBounds(bbox)
        } else {
            const center = get_middle_of_bounding_box(bbox)
            map.setView(center, config.room_zoom)
        }     
    }
    if(type === 'entities' || type === 'all') {
        bbox[0][0] -= config.highlighted_entity_margin
        bbox[0][1] -= config.highlighted_entity_margin
        bbox[1][0] += config.highlighted_entity_margin
        bbox[1][1] += config.highlighted_entity_margin
        map.fitBounds(bbox)
    }
}

module.exports = {
    focus_map
}