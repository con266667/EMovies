export const videoImage = (id, state) => {
    if (state.videoInfo.videoInfo.images[id] !== undefined) {
        if (state.videoInfo.videoInfo.images[id].backdrops.length > 0) {
            return 'https://image.tmdb.org/t/p/original/' + state.videoInfo.videoInfo.images[id].backdrops[0].file_path;
        }
        return 'https://image.tmdb.org/t/p/original/' + state.videoInfo.videoInfo.images[id].posters[0].file_path;
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg';
}