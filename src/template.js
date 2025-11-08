const template_data = $('#map').data()

const types = {
    'Episode': 'episodes',
    'Room': 'rooms',
    'Entity': 'entities',
}
const type = types[template_data.type]
const targets = template_data.target.split(';').map(target => target.trim())
const color = template_data.color === '{{{color}}}' ? null : template_data.color

module.exports = {
    type,
    targets,
    color
}