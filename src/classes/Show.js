class Show {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.image = data.image;
        this.seasons = data.seasons;
    }
}

class Season {
    constructor(data) {
        this.id = data.id;
        this.poster = data.poster;
        this.number = data.number;
        this.episodes = data.episodes;
    }
}

class Episode {
    constructor(data) {
        this.id = data.id;
        this.number = data.number;
        this.name = data.name;
        this.season = data.season;
        this.description = data.description;
        this.image = data.image;
    }
}