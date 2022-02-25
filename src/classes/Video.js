export default class Video {
    constructor(title, year, description, poster, backdrop, ids, isMovie) {
        this.title = title;
        this.year = year;
        this.description = description;
        this.poster = poster;
        this.backdrop = backdrop;
        this.ids = ids;
        this.isMovie = isMovie;
        this.episode = 0;
        this.season = 0;
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
            return state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].find(v => (v['movie'] ?? v['show']).ids.imdb === this.ids.imdb).progress;
        } catch (e) {console.log(e)}
        return 0;
    }

    get valid () {
        return this.title !== '' && this.year !== '' && this.poster !== '' && this.backdrop !== '';
    }
}
