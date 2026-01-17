function generateEpisodesFromRooms(geojson) {
    const episodesMap = new Map();

    for (const feature of geojson.features) {
        const episodeName = feature.properties.episode;
        if (!episodeName) continue;

        if (!episodesMap.has(episodeName)) {
            episodesMap.set(episodeName, []);
        }

        episodesMap.get(episodeName).push(feature.geometry.coordinates);
    }

    return {
        type: "FeatureCollection",
        features: Array.from(episodesMap.entries()).map(
            ([episodeName, polygons]) => ({
                type: 'Feature',
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: polygons
                },
                properties: {
                    name: episodeName,
                    category: 'Episode'
                }
            })
        )
    };
}

module.exports = generateEpisodesFromRooms;