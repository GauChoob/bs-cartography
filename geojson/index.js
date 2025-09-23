const episodes = require('./episodes.json')
const rooms = require('./rooms.json')
const room_data = require('./room_data.json')

const hopeport = require('./entities/hopeport.json');
const hopeforest = require('./entities/hopeforest.json');
const mineofmantuban = require('./entities/mineofmantuban.json');
const crenopolis = require('./entities/crenopolis.json');
	
const entities = {
	type: 'FeatureCollection',
	features: [
		...hopeport.features,
		...hopeforest.features,
		...mineofmantuban.features,
		...crenopolis.features
	]
};

module.exports = {
    episodes,
    rooms,
    entities,
    room_data,
}