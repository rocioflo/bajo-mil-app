import "./styles/App.scss";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function StartWelcome() {
  return <div>¡Bienvenide! Musiquita para todes :)</div>;
}

function ArtistCall({
  handleSelectArtist,
  handleFilter,
  filteredData,
  filter,
  artistList,
}) {
  return (
    <form className="first-form">
      <label className="first-form-label">
        Dime un artista que le hable a tu alma
        <input
          className="first-form-input"
          type="text"
          placeholder="Taylor Swift..."
          onChange={handleFilter}
          value={filter}
        />
        {artistList === "see" && (
          <ArtistList
            filteredData={filteredData}
            handleSelectArtist={handleSelectArtist}
          />
        )}
      </label>
    </form>
  );
}

function ArtistList({ filteredData, handleSelectArtist }) {
  const filterList = filteredData.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  return (
    <select className="first-form-select" onChange={handleSelectArtist}>
      {filterList}
    </select>
  );
}

function GenreForm({ handleSelectGenre, genreList }) {
  const genreMap = genreList.map((genre, index) => (
    <option key={index} value={genre}>
      {genre}
    </option>
  ));

  return (
    <form className="second-form">
      <label className="second-form-label">Selecciona tu ritmo ragatanga</label>
      <select className="second-form-input" onChange={handleSelectGenre}>
        {genreMap}
      </select>
    </form>
  );
}

function Recommendation({ recommendation, byGenre, byArtist, artist, genre }) {
  return (
    <>
      {genre && byGenre && <p>Carrrrgaannndo que es geruuuuundioooo</p>}

      {artist && byArtist && <p>Carrrrgaannndo que es geruuuuundioooo</p>}
      {recommendation && (!byArtist || !byGenre) && (
        <div className="recommendation">
          <p>Échale un oído a</p>
          <p>{recommendation.name}</p>
          <p>{recommendation.artist}</p>
          <img
            alt={`It's ${recommendation.name} by ${recommendation.artist}`}
            src={recommendation.image}
            className="recommendation-img"
          />
          <a href={recommendation.url} target="_blank" rel="noreferrer">
            Escúchala aquí
          </a>
        </div>
      )}
    </>
  );
}

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");

  const [recommendation, setRecommendation] = useState(null);

  const [genre, setGenre] = useState(null);
  const [artist, setArtist] = useState(null);
  const [watching, setWatching] = useState("start");
  const [artistList, setArtistList] = useState("");
  const [genreList, setGenreList] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { isLoading: byGenre } = useQuery(
    ["songsByGenre", genre],
    () => {
      return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=5&max_popularity=1`,
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
        `https://api.spotify.com/v1/recommendations?seed_artists=${artist}&limit=5&max_popularity=13`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: ({ data }) => {
        console.log(data, "de artistas");

        const cleanData = {
          artist: data.tracks[0].artists[0].name,
          name: data.tracks[0].name,
          image: data.tracks[0].album.images[1].url,
          url: data.tracks[0].external_urls.spotify,
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
        setFilteredData(data.artists.items);
        console.log(filteredData);
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
        console.log(data.genres);
        setGenreList(data.genres);
      },
      enabled: !!token,
    }
  );

  // useEffect(() => {
  //   const hash = window.location.hash;
  //   let token = window.localStorage.getItem("token");

  //   if (!token && hash) {
  //     token = hash
  //       .substring(1)
  //       .split("&")
  //       .find((elem) => elem.startsWith("access_token"))
  //       .split("=")[1];

  //     window.location.hash = "";
  //     window.localStorage.setItem("token", token);
  //   }

  //   setToken(token);
  // }, []);

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
    console.log(value);
    setArtist(value);
  };

  const handleSelectGenre = (ev) => {
    const value = ev.target.value;
    console.log(value);
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
        {/* <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a> */}
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
          <ArtistCall
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
        />
      </main>
      <footer className="footer">
        <p>By Ro Flo :)</p>
      </footer>
    </div>
  );
}

export default App;
