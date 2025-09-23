import json
import glob
import os

def parse_feature(feature):
    properties = feature['properties']
    name = properties['name']
    icon = ''
    for classname in properties['classes']:
        if classname == 'icon-obstacle':  # No icon
            continue
        if classname.startswith('icon-'):
            icon = f'[[File:{classname[5:].title()}_small_icon.png|16px]]'
    if 'link' in properties:
        link = properties['link']
        return icon + f'{name}: [[{link}]]'
    return icon + f'[[{name}]]'

features = []
for path in glob.glob(os.path.join('geojson','entities','*.json')):
    with open(path, 'r') as f:
        data = json.load(f)
        if data.get('type') == 'FeatureCollection':
            features.extend(data.get('features',[]))
            
links = {parse_feature(f) for f in features}
links_list = sorted(links)

with open('dist/entity_links.txt', 'w') as f:
    f.write('\n\n'.join(links_list))
