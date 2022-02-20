export default class Video {
    constructor(title, year, description, poster, backdrop, ids, isMovie) {
        this.title = title;
        this.year = year;
        this.description = description;
        this.poster = poster;
        this.backdrop = backdrop;
        this.ids = ids;
        this.isMovie = isMovie;
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
        if (
            state.auth.auth.watchProgress !== undefined
            && state.auth.auth.watchProgress[state.auth.auth.currentUserUUID] !== undefined
            && state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].filter(v => (v['movie'] ?? v['show']).ids.imdb === this.ids.imdb).length > 0
        ) {
            return state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].filter(v => (v['movie'] ?? v['show']).ids.imdb === this.ids.imdb).sort((a,b) => Date(b.paused_at) - Date(a.paused_at)).filter((v,i,a)=>a.findIndex(t=>(t.show.ids.imdb===v.show.ids.imdb))===i)[0].progress;
        }
        return 0;
    }
}
