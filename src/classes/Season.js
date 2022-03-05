// class Show {
//     constructor(data) {
//         this.id = data.id;
//         this.name = data.name;
//         this.description = data.description;
//         this.image = data.image;
//         this.seasons = data.seasons;
//     }
// }

import Episode from "./Episode";

export default class Season {
    constructor(tmdbdata) {
        this.ids = {
            tmdb: tmdbdata.id
        };
        this.poster = tmdbdata.poster_path;
        this.number = tmdbdata.season_number;
        this.episodes = tmdbdata.episodes;
        this.release = new Date(tmdbdata.air_date);
        this.episodes = tmdbdata.episodes.map(e => {
            return new Episode(e)
        });
    }
}