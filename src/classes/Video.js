export default class Video {
    constructor(title, year, description, poster, backdrop, ids, isMovie, paused_at = '') {
        this.title = title;
        this.year = year;
        this.description = description;
        this.poster = poster;
        this.backdrop = backdrop;
        this.ids = ids;
        this.isMovie = isMovie;
        this.episode = 0;
        this.season = 0;
        this.paused_at = paused_at;
        this.seasons = [];
    }

    open (navigation) {
        navigation.navigate('Player', {
            video: this,
        });
    }

    openShow (navigation) {
        navigation.navigate('TVShow', {
            show: this,
        });
    }

    videoImage (state) {
        if (this.backdrop != '') {
            return this.backdrop;
        }
        if (state.videoInfo.videoInfo.images[this.ids.imdb] !== undefined) {
            if (state.videoInfo.videoInfo.images[this.ids.imdb].backdrops.length > 0) {
                return 'https://image.tmdb.org/t/p/original' + state.videoInfo.videoInfo.images[this.ids.imdb].backdrops[0].file_path;
            } else if (state.videoInfo.videoInfo.images[this.ids.imdb].posters.length > 0) {
                return 'https://image.tmdb.org/t/p/original' + state.videoInfo.videoInfo.images[this.ids.imdb].posters[0].file_path;
            }
        }
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg';
    }

    posterImage (state) {
        if (this.poster != '') {
            return this.poster;
        }
        if (state.videoInfo.videoInfo.images[this.ids.imdb] !== undefined) {
            if (state.videoInfo.videoInfo.images[this.ids.imdb].posters.length > 0) {
                return 'https://image.tmdb.org/t/p/original' + state.videoInfo.videoInfo.images[this.ids.imdb].posters[0].file_path;
            }
        }
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg';
    }

    getEpisode (number, season, seasons = this.seasons) {
        if (seasons[season] !== undefined) {
            return seasons[season].episodes.find(e => e.number === number);
        }
        return undefined;
    }

    nextEpisode (episode) {
        var _episode;
        if (episode.season < this.seasons.length) {
            if (episode.number + 1 < this.seasons[episode.season].episodes.length) {
                _episode = this.seasons[episode.season].episodes[episode.number + 1];
            }
        } else if (episode.season + 1 < this.seasons.length) {
            _episode = this.seasons[episode.season + 1].episodes[0];
        }
        if (_episode === undefined || _episode.release > new Date()) {
            return undefined;
        }
        return _episode;
    }

    nextEpisodeWithProgress (episode, playback) {
        var _episode = this.nextEpisode(episode);
        var _playbackEpisode = playback
            .filter(
                v => v['type'] === 'episode' 
                && v.show.ids.imdb === this.ids.imdb
                && v.episode.season === _episode.season
                && v.episode.number === _episode.number
            )
        var progress = 0;
        if (_playbackEpisode.length > 0) {
            progress = _playbackEpisode[0].progress;
        }

        return _episode.withProgress(progress);
    }

    watchNext (state, seasons = this.seasons, playback) {
        var _playback = playback;

        try {
            if (_playback === undefined) {
                _playback = state.auth.auth.watchProgress[state.auth.auth.currentUserUUID];
            }

            var _playbackEpisode = _playback
                .filter(
                    v => v['type'] === 'episode' 
                    && v.show.ids.imdb === this.ids.imdb
                )
                .sort((a,b) => Date(b.paused_at) - Date(a.paused_at))[0];
            
            var _episode

            if (_playbackEpisode.progress > 96) {
                return this.nextEpisodeWithProgress(_playbackEpisode.episode, _playback);
            }

             _episode = this.getEpisode(_playbackEpisode.episode.number, _playbackEpisode.episode.season, seasons);

            return _episode.withProgress(_playbackEpisode.progress);
        } catch (_) {}
        return undefined;
    }

    playbackEpisode(state, episode = this.episode, season = this.season) {
        try {
            return state.auth.auth.watchProgress[state.auth.auth.currentUserUUID]
                .filter(
                    v => v['type'] === 'episode' 
                    && v.show.ids.imdb === this.ids.imdb 
                    && (
                        episode === 0 
                        || 
                        (v.episode.number === episode && v.episode.season === season)
                    )
                )
                .sort((a,b) => Date(b.paused_at) - Date(a.paused_at))[0];
        } catch (_) {}
        return undefined;
    }

    progress (state) {
        try {
            if (this.isMovie) {
                return state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].find(v => v['type'] === 'movie' && v.movie.ids.imdb === this.ids.imdb).progress;
            } else {
                return this.playbackEpisode(state);
            }
        } catch (_) {}
        return 0;
    }

    get valid () {
        return this.title !== '' && this.year !== '' && this.poster !== '' && this.backdrop !== '';
    }
}
