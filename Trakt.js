const userLoginDetails = () => async () => {
    const response = await fetch(
        'https://api.trakt.tv/oauth/device/code?client_id=bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819',
        {
            method: 'POST',
        }
    );
    const json = await response.json();
    console.log(json)
    return json;
};

export default userLoginDetails;