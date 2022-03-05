export default class Episode {
    constructor(tmdbdata) {
        this.ids = {
            tmdb: tmdbdata.id
        };
        this.number = tmdbdata.episode_number ?? 0;
        this.name = tmdbdata.name ?? '';
        this.season = tmdbdata.season_number ?? 0;
        this.description = tmdbdata.overview ?? '';
        this.image = tmdbdata.still_path ?? '';
        this.release = new Date(tmdbdata.air_date) ?? new Date();
        this.progress = 0;
    }

    withProgress(progress) {
        this.progress = progress;
        return this;
    }

    // constructor(ids, number, name, season, description, image, progress = 0, release) {
    //     this.ids = ids;
    //     this.number = number;
    //     this.name = name;
    //     this.season = season;
    //     this.description = description;
    //     this.image = image;
    //     this.progress = progress;
    //     this.release = release;
    // }
}