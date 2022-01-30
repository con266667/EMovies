from bs4 import BeautifulSoup
from time import sleep
from requests_html import HTMLSession
from selenium import webdriver

def get_source_link(page_link, html_session, browser):
    browser.get(page_link)
    sleep(2)
    
    browser.switch_to.frame('external-embed')
    sleep(2)

    html = browser.page_source

    soup = BeautifulSoup(html, 'html5lib')
    video_tags = soup.findAll('video')
    for video_tag in video_tags:
        final_src = video_tag.get('src')
        return final_src
    
    # browser.quit()

def get_movie_from_vh(link, html_session, browser, episode=0):
    response = html_session.get(link)
    response.html.render()
    iframes = response.html.find("a")

    for iframe in iframes:
        if "href" in iframe.attrs and iframe.attrs["href"] == ("#watching.html?ep=" + str(episode)) and "data-embed" in iframe.attrs:
            iframe_src = iframe.attrs["data-embed"]
            return get_source_link(iframe_src, html_session, browser)

def get_movie_from_title(title, html_session, browser, episode=0):
    response = html_session.get("https://vhmovies.com/search/?keyword=" + title)
    response.html.render()
    movie_links = response.html.find("a")
    for movie_link in movie_links:
        if "title" in movie_link.attrs and 'class' in movie_link.attrs and 'halim-thumb' in movie_link.attrs['class']:# and movie_link.attrs["title"] == title:
            movie_link = movie_link.attrs["href"]
            return get_movie_from_vh("https://vhmovies.com" + movie_link + "watching.html?ep=" + str(episode), html_session, browser, episode=episode)
            
get_movie_from_title("Spider-Man", HTMLSession(), webdriver.Safari())