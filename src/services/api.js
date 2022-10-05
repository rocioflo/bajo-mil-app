function CallToApi(token, genre) {
  fetch(
    `https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}&target_popularity=0`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.tracks[0].artists[0].name);

      const cleanData = {
        artist: data.tracks[0].artists[0].name,
        name: data.tracks[0].name,
        image: data.tracks[0].album.images[1].url,
      };

      console.log(cleanData);
      return cleanData;
    });
}

export default CallToApi;
