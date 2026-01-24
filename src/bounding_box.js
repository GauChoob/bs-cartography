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

function update_bounds_from_geometry(bounds, geometry) {
    if (geometry.type === 'Point') {
        update_bounds(bounds, geometry.coordinates)
        return;
    }

    if (geometry.type === 'Polygon') {
        for (let i = 0; i < geometry.coordinates.length; i++) {
            for (let j = 0; j < geometry.coordinates[i].length; j++) {
                update_bounds(bounds, geometry.coordinates[i][j]);
            }
        }
    }

    if (geometry.type === 'MultiPolygon') {
        for (let i = 0; i < geometry.coordinates.length; i++) {
            for (let j = 0; j < geometry.coordinates[i].length; j++) {
                for (let k = 0; k < geometry.coordinates[i][j].length; k++) {
                    update_bounds(bounds, geometry.coordinates[i][j][k]);
                }
            }
        }
    }
}

const get_bounding_box = (features) => {
    const bounds = [[Infinity, Infinity], [-Infinity, -Infinity]]

    for (let i = 0; i < features.length; i++) {
        update_bounds_from_geometry(bounds, features[i].geometry)
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