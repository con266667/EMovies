import { getActionMovies, getActionShows, getComedyMovies, getComedyShows, getRecentlyWatchedShows, getRecentlyWatchedVideos, getTopMovies, getTopShows } from "./Trakt";

export const loadLists = async (currentUser, dispatch) => {
    loadHome(currentUser, dispatch);
    loadTV(currentUser, dispatch);
}

const loadHome = async (currentUser, dispatch) => {
    const recentlyWatchedVideos = await getRecentlyWatchedVideos(currentUser, dispatch);
    const trendingMovies = await getTopMovies();
    const actionMovies = await getActionMovies();
    const comedyMovies = await getComedyMovies();

    const lists = [
        {
            'page': 'home',
            'title': 'Recently Watched',
            'items': recentlyWatchedVideos.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'home',
            'title': 'Trending',
            'items': trendingMovies.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'home',
            'title': 'Action',
            'items': actionMovies.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'home',
            'title': 'Comedy',
            'items': comedyMovies.filter(v => v !== undefined && v.valid)
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
        'page': 'tv',
        'title': 'Recently Watched',
        'items': recentlyWatchedShows.filter(v => v !== undefined && v.valid)
      },
      {
        'page': 'tv',
        'title': 'Top Shows',
        'items': topShows.filter(v => v !== undefined && v.valid)
      },
      {
        'page': 'tv',
        'title': 'Action',
        'items': actionShows.filter(v => v !== undefined && v.valid)
      },
      {
        'page': 'tv',
        'title': 'Comedy',
        'items': comedyShows.filter(v => v !== undefined && v.valid)
      }
    ]

    dispatch({ type: 'UPDATE_LISTS', payload: {
        lists: lists,
        page: 'tv',
        uuid: currentUser.uuid
    }});
}