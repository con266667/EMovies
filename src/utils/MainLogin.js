import { getActionMovies, getActionShows, getComedyMovies, getComedyShows, getRecentlyWatchedShows, getRecentlyWatchedVideos, getRecomededVideos, getTopMovies, getTopShows } from "./Trakt";

export const loadLists = async (currentUser, dispatch) => {
    const home = await loadHome(currentUser, dispatch);
    const tv = await loadTV(currentUser, dispatch);
    const movies = await loadMovies(currentUser, dispatch);

    dispatch({ type: 'UPDATE_LISTS', payload: {
        lists: [...home, ...tv, ...movies],
        uuid: currentUser.uuid
    }});
}

const loadHome = async (currentUser, dispatch) => {
    const recentlyWatchedVideos = await getRecentlyWatchedVideos(currentUser, dispatch);
    const recommendations = await getRecomededVideos(currentUser, dispatch);

    const lists = [
        {
            'page': 'home',
            'title': 'Continue Watching',
            'items': recentlyWatchedVideos.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'home',
            'title': 'Recommended',
            'items': recommendations.filter(v => v !== undefined && v.valid)
        }
    ]

    return lists;
}

const loadTV = async (currentUser, dispatch) => {
    const recentlyWatchedShows = await getRecentlyWatchedShows(currentUser, dispatch);
    const topShows = await getTopShows();
    const actionShows = await getActionShows();
    const comedyShows = await getComedyShows();

    const lists = [
      {
        'page': 'tv',
        'title': 'Continue Watching',
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

    return lists;
}

const loadMovies = async (currentUser, dispatch) => {
    const trendingMovies = await getTopMovies();
    const actionMovies = await getActionMovies();
    const comedyMovies = await getComedyMovies();

    const lists = [
        {
            'page': 'movies',
            'title': 'Trending',
            'items': trendingMovies.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'movies',
            'title': 'Action',
            'items': actionMovies.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'movies',
            'title': 'Comedy',
            'items': comedyMovies.filter(v => v !== undefined && v.valid)
        }
    ];

    return lists;
}