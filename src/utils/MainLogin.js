import { getActionMovies, getActionShows, getComedyMovies, getComedyShows, getRecentlyWatchedShows, getTopMovies, getTopShows } from "./Trakt";

export const loadLists = async (currentUser, dispatch) => {
    loadHome(currentUser, dispatch);
    loadTV(currentUser, dispatch);
}

const loadHome = async (currentUser, dispatch) => {
    const trendingMovies = await getTopMovies();
    const actionMovies = await getActionMovies();
    const comedyMovies = await getComedyMovies();

    const lists = [
        {
            'title': 'Trending',
            'items': trendingMovies.filter(v => v !== undefined && v.valid)
        },
        {
            'title': 'Action',
            'items': actionMovies.filter(v => v !== undefined && v.valid)
        },
        {
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
        'title': 'Recently Watched',
        'items': recentlyWatchedShows.filter(v => v !== undefined && v.valid)
      },
      {
        'title': 'Top Shows',
        'items': topShows.filter(v => v !== undefined && v.valid)
      },
      {
        'title': 'Action',
        'items': actionShows.filter(v => v !== undefined && v.valid)
      },
      {
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