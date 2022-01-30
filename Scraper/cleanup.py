import json

with open("data.json",'r+') as file:
    data = json.load(file)
    data['movies']
    file.seek(0)
    json.dump(data, file, indent=4)
