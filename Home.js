import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieGenre, getMovieRecommendations, getMoviesWatched, getPopularMovies, getTop10BoxOffice, getTrendingMovies } from './Trakt';
import Page from './Page';
  

const Home = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();

  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  const isCached = (page) => {
    return !(
         state.auth.auth.lists[currentUser().uuid] === undefined
      || state.auth.auth.lists[currentUser().uuid][page] === undefined
      || state.auth.auth.lists[currentUser().uuid][page]["lists"] === undefined
      || state.auth.auth.lists[currentUser().uuid][page]["lists"].length === 0
      || ((Date.now() - state.auth.auth.lists[currentUser().uuid][page]["lastUpdated"]) > 3)
    )
  }

  const genres = [
    'Action',
    'Comedy',
    'Crime',
    'Drama',
    'Horror',
    'Documentary'
  ]

  useEffect(() => {
    const setup = async () => {
      if (!isCached('home')) { 
          var movieRecommendations = await getMovieRecommendations(currentUser(), dispatch, state);
          var trendingMovies = await getTrendingMovies(currentUser(), dispatch, state);
          // var popularMovies = await getPopularMovies(currentUser(), dispatch, state);
          // var top10 = await getTop10BoxOffice(currentUser(), dispatch, state);

          const getGenre = async (genre) => {
            var items = await getMovieGenre(genre.toLowerCase(), currentUser(), dispatch, state);
            return {
              'title': genre,
              'items': items
            }
          }

          const genresLists = await Promise.all(genres.map(getGenre));

          const lists = [
            // {
            //   'title': 'Continue Watching',
            //   'items': moviesWatched
            // },
            {
              'title': 'Trending',
              'items': trendingMovies
            },
            // {
            //   'title': 'Recommended',
            //   'items': movieRecommendations
            // },
            // {
            //   'title': 'Popular',
            //   'items': popularMovies
            // },
            // {
            //   'title': 'Top 10',
            //   'items': top10
            // },
            ...genresLists
          ]

          dispatch({ type: 'UPDATE_LISTS', payload: {
            lists: lists,
            page: 'home',
            uuid: currentUser().uuid
          }})

          setLists(_ => lists);
      } else {
        console.log("Using cached data");
        setLists(_ => state.auth.auth.lists[currentUser().uuid]["home"]["lists"]);
      }
    }

    if (lists.length === 0) {
     setup();
    }
  }, [setLists]);

  return (
    <Page lists={lists} {...props}></Page>
  );
};

export default Home;