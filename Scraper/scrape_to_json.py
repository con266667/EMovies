import json
from vhmovies import get_movie_from_title
from requests_html import HTMLSession
from selenium import webdriver

s = HTMLSession()
browser = webdriver.Safari()

movies = []

with open("titles.json",'r') as file:
    # Add movies to JSON file
    data = json.load(file)
    movies = list(dict.fromkeys(data['movies']))

loaded_movies = []
errors = []

with open("data.json",'r') as file:
    # Add movies to JSON file
    data = json.load(file)
    loaded_movies = data['movies']

for movie in movies:
    if movie not in loaded_movies.keys():
        print(movie)
        try:
            link = get_movie_from_title(movie, s, browser)
            print(movie + " -> " + link)
            loaded_movies[movie] = link
        except:
            print("Error: " + movie)
            errors.append(movie)

#Write to data.json

with open("data.json",'r+') as file:
    data = json.load(file)
    data['movies'].update(loaded_movies)
    file.seek(0)
    json.dump(data, file, indent=4)
