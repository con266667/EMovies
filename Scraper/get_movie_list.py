import requests
import json


def get_discover_page(page_number):
    response = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=6ba0d338722bb3a7b301fdb45104bfcd&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" + str(page_number))
    movies = []
    for movie in response.json()['results']:
        movies.append(movie['title'])
    return movies
 
all_movies = []

for i in range(2, 15):
    movies = get_discover_page(i)
    all_movies.extend(movies)

# function to add to JSON
with open("titles.json",'r+') as file:
    # Add movies to JSON file
    data = json.load(file)
    data['movies'] += all_movies
    file.seek(0)
    json.dump(data, file, indent=4)