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

    progress (state) {
        try {
            if (this.isMovie) {
                return state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].find(v => v['type'] === 'movie' && v.movie.ids.imdb === this.ids.imdb).progress;
            } else {
                return state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].filter(v => v['type'] === 'episode' && v.show.ids.imdb === this.ids.imdb && (this.episode === 0 || (v.episode.number === this.episode && v.episode.season === this.season))).sort((a,b) => Date(b.paused_at) - Date(a.paused_at))[0].progress;
            }
        } catch (_) {}
        return 0;
    }

    get valid () {
        return this.title !== '' && this.year !== '' && this.poster !== '' && this.backdrop !== '';
    }
}
