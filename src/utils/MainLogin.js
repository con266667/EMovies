import { getActionMovies, getActionShows, getComedyMovies, getComedyShows, getDocumentaryMovies, getHorrorMovies, getRecentlyWatchedVideos, getRecomededVideos, getTopMovies, getTopShows } from "./Trakt";

export const loadLists = async (currentUser, dispatch) => {
    const rw = (await getRecentlyWatchedVideos(currentUser, dispatch)).filter(v => v !== undefined && v.valid);
    const home = await loadHome(currentUser, rw, dispatch);
    const tv = await loadTV(currentUser, rw, dispatch);
    const movies = await loadMovies(currentUser, rw, dispatch);

    dispatch({ type: 'UPDATE_LISTS', payload: {
        lists: [...home, ...tv, ...movies],
        uuid: currentUser.uuid
    }});
}

const loadHome = async (currentUser, recentlyWatchedVideos, dispatch) => {
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

const loadTV = async (currentUser, recentlyWatchedVideos, dispatch) => {
    const recentlyWatchedShows = recentlyWatchedVideos.filter(v => !v.isMovie);
    const topShows = await getTopShows();
    const actionShows = await getActionShows();
    const comedyShows = await getComedyShows();

    const lists = [
      {
        'page': 'tv',
        'title': 'Continue Watching',
        'items': recentlyWatchedShows
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

const loadMovies = async (currentUser, recentlyWatchedVideos, dispatch) => {
    const trendingMovies = await getTopMovies();
    const actionMovies = await getActionMovies();
    const comedyMovies = await getComedyMovies();
    const documentaryMovies = await getDocumentaryMovies();
    const horrorMovies = await getHorrorMovies();

    const lists = [
        {
            'page': 'movies',
            'title': 'Continue Watching',
            'items': recentlyWatchedVideos.filter(v => v.isMovie && v !== undefined && v.valid)
        },
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
        },
        {
            'page': 'movies',
            'title': 'Documentary',
            'items': documentaryMovies.filter(v => v !== undefined && v.valid)
        },
        {
            'page': 'movies',
            'title': 'Horror',
            'items': horrorMovies.filter(v => v !== undefined && v.valid)
        }
    ];

    return lists;
}