import { getActionMovies, getActionShows, getComedyMovies, getComedyShows, getRecentlyWatchedShows, getTopMovies, getTopShows } from "./Trakt";

export const loadLists = async (currentUser, dispatch) => {
    loadHome(currentUser, dispatch);
    loadTV(currentUser, dispatch);
}

const loadHome = async (currentUser, dispatch) => {
    var trendingMovies = await getTopMovies();
    var actionMovies = await getActionMovies();
    var comedyMovies = await getComedyMovies();

    const lists = [
        {
            'title': 'Trending',
            'items': trendingMovies
        },
        {
            'title': 'Action',
            'items': actionMovies
        },
        {
            'title': 'Comedy',
            'items': comedyMovies
        }
    ]

    dispatch({ type: 'UPDATE_LISTS', payload: {
        lists: lists,
        page: 'home',
        uuid: currentUser.uuid
    }})
}

const loadTV = async (currentUser, dispatch) => {
    const recentlyWatchedShows = await getRecentlyWatchedShows(currentUser, dispatch);
    const topShows = await getTopShows();
    const actionShows = await getActionShows();
    const comedyShows = await getComedyShows();

    const lists = [
      {
        'title': 'Recently Watched',
        'items': recentlyWatchedShows
      },
      {
        'title': 'Top Shows',
        'items': topShows
      },
      {
        'title': 'Action',
        'items': actionShows
      },
      {
        'title': 'Comedy',
        'items': comedyShows
      }
    ]

    dispatch({ type: 'UPDATE_LISTS', payload: {
        lists: lists,
        page: 'tv',
        uuid: currentUser.uuid
    }});
}