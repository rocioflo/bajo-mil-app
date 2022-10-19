import "./styles/App.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import StartWelcome from "./components/StartWelcome";
import ArtistForm from "./components/ArtistForm";
import GenreForm from "./components/GenreForm";
import Recommendation from "./components/Recommendation";

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

  const [token, setToken] = useState("");

  const [recommendation, setRecommendation] = useState(null);

  const [genre, setGenre] = useState(null);
  const [artist, setArtist] = useState(null);
  const [watching, setWatching] = useState("start");
  const [artistList, setArtistList] = useState("");
  const [genreList, setGenreList] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoading: byGenre } = useQuery(
    ["songsByGenre", genre],
    () => {
      return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=5&max_popularity=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: ({ data }) => {
        console.log(data);

        const cleanData = {
          artist: data.tracks[0].artists[0].name,
          name: data.tracks[0].name,
          image: data.tracks[0].album.images[1].url,
          url: data.tracks[0].external_urls.spotify,
        };

        setRecommendation(cleanData);
      },
      enabled: !!token && !!genre,
    }
  );

  const { isLoading: byArtist } = useQuery(
    ["songsByArtist", artist],
    () => {
      return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_artists=${artist}&limit=5&max_popularity=26`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 2000,
        }
      );
    },
    {
      onSuccess: ({ data }) => {
        console.log(data, "de artistas");

        if (data.tracks.length === 0) {
          console.log("oh no");
          setErrorMessage("error");
          return null;
        }

        setErrorMessage("");

        // let popularity = [];

        // for (const item of data.tracks) {
        //   popularity.push(item.popularity);
        // }

        // let leastPopularIndex = popularity[0];

        // for (const number of popularity) {
        //   if (number <= leastPopularIndex) {
        //     leastPopularIndex = number;
        //   }
        // }

        const chosenArtist = data.tracks[0];

        const cleanData = {
          artist: chosenArtist.artists[0].name,
          name: chosenArtist.name,
          image: chosenArtist.album.images[1].url,
          url: chosenArtist.external_urls.spotify,
        };

        setRecommendation(cleanData);
      },
      enabled: !!token && !!artist,
    }
  );

  const { isLoading: searchArtist } = useQuery(
    ["artistFilter", filter],
    () => {
      return axios.get(
        `https://api.spotify.com/v1/search?q=${filter}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: ({ data }) => {
        let artistData = data.artists.items;
        setFilteredData(artistData);
        console.log(filteredData);
      },
      onError: () => {
        console.log("error");
      },
      enabled: !!filter,
    }
  );

  const { isLoading: searchGenre } = useQuery(
    ["genreFilter", filter],
    () => {
      return axios.get(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: ({ data }) => {
        setGenreList(data.genres);
      },
      enabled: !!token,
    }
  );

  const { data } = useQuery(
    ["token"],
    () => {
      let myHeaders = new Headers();
      const lelele = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      myHeaders.append("Authorization", `Basic ${lelele}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("grant_type", "client_credentials");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      return fetch("https://accounts.spotify.com/api/token", requestOptions);
    },
    {
      onSuccess: async (data) => {
        const tokenData = await data.json();
        const tokenNumber = tokenData.access_token;
        setToken(tokenNumber);
      },
      staleTime: 3600,
    }
  );

  const handleSelectArtist = (ev) => {
    const value = ev.target.value;
    setArtist(value);
  };

  const handleSelectGenre = (ev) => {
    const value = ev.target.value;
    setGenre(value);
  };

  const handleFilter = (ev) => {
    setFilter(ev.target.value);
    setArtistList("see");
  };

  return (
    <div className="App">
      <header className="header">
        <a className="title" href={REDIRECT_URI}>
          Bajo mil
        </a>
        <nav className="menu">
          <a className="menu-artist" onClick={() => setWatching("artist")}>
            Por artista
          </a>
          <a className="menu-genre" onClick={() => setWatching("genre")}>
            Por género
          </a>
        </nav>
      </header>
      <main>
        {watching === "start" && <StartWelcome />}
        {watching === "artist" && (
          <ArtistForm
            handleSelectArtist={handleSelectArtist}
            handleFilter={handleFilter}
            filteredData={filteredData}
            filter={filter}
            artistList={artistList}
          />
        )}
        {watching === "genre" && (
          <GenreForm
            handleSelectGenre={handleSelectGenre}
            genreList={genreList}
          />
        )}

        <Recommendation
          recommendation={recommendation}
          byArtist={byArtist}
          byGenre={byGenre}
          artist={artist}
          genre={genre}
          errorMessage={errorMessage}
        />
      </main>
      <footer className="footer">
        <p>By Ro Flo :)</p>
      </footer>
    </div>
  );
}

export default App;
