const config = require('./config.js')
const highlight = require('./highlight.js')
const bounding_box = require('./bounding_box.js')

const get_search_options = () => {
    const search_options = new Set()

    for(const key of ['episodes', 'rooms', 'entities']) {
        if (!window.geojson[key] || !window.geojson[key].features) continue;
        for(const item of window.geojson[key].features) {
            search_options.add(item.properties.name)
        }
    }
    return Array.from(search_options).sort()
}

const Search = L.Control.extend({
    onAdd: function(map) {
        const search = L.DomUtil.create('div', 'leaflet-wiki-search')
        const search_options = get_search_options()
        const options = search_options.map(option => `<option>${option}</option>`).join('')
        search.innerHTML = `<datalist id="leaflet-wiki-search-suggestions">${options}</datalist>`
        const search_input = L.DomUtil.create('input', null, search)
        search_input.type = 'text'
        search_input.placeholder = 'Search...'
        search_input.autoComplete = 'on'
        search_input.setAttribute('list', 'leaflet-wiki-search-suggestions')
        for(const listener of ['click', 'dblclick', 'mousedown']) {
            search_input.addEventListener(listener, function(e) {
                if(ENV.DEBUG === true) {
                    console.log(listener)
                }
                e.stopPropagation()
            })
        }
        search_input.addEventListener('input', function(e) {
            if(this.value.length >= config.minimum_characters_in_automatic_search) {
                const targets = this.value.split(';').map(target => target.trim())
                highlight.highlightSearch(map, 'all', targets, false)
            } else {
                highlight.highlightSearch(map, 'all', ['^^NO TARGET - STRING WITH NO MATCHES^^'], true)
            }
        })
        search_input.addEventListener('keyup', function(e) {
            if(e.key === 'Enter') {
                const targets = this.value.split(';').map(target => target.trim())
                highlight.highlightSearch(map, 'all', targets, false)
                bounding_box.focus_map(map, 'all', targets, false)
            }
        })
        return search
    },
    onRemove: function(map) {}
})

function add_search_bar(map) {
    new Search({position: 'topright'}).addTo(map)
}

module.exports = {
    add_search_bar,
}