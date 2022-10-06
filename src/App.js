import './styles/App.scss';
import CallToApi from './services/api';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function StartWelcome() {
  return <div>¡Bienvenide! Musiquita para todes :)</div>
}

function ArtistForm({handleSelect}) {
  return <form className="first-form">
          <label className="first-form-label">
            Selecciona un artista que le hable a tu alma
            <select className='first-form-select' onChange={handleSelect}>
              <option value='06HL4z0CvFAxyc27GXpf02'>Taylor Swift</option>
              <option value='21TinSsF5ytwsfdyz5VSVS'>Dodie</option>
              <option value='3lFDsTyYNPQc8WzJExnQWn'>Sammy Rae & The Friends</option>
            </select>
          </label>
          <input type="submit" value="Dale" className="first-form-button" />
        </form>
}

function GenreForm({handleRadio}) {
  return <form className="second-form">
  <label className="second-form-label">Selecciona un género</label>
  <label className='genre-pop'>
    Pop
    <input
      type="radio"
      name="genre"
      value="pop"
      className='input-pop'
      onChange={handleRadio}
    />
  </label>
  <label className='genre-indie'>
    Indie
    <input
      type="radio"
      name="genre"
      value="indie"
      onChange={handleRadio}
    />
  </label>
  <label className='genre-blues'>
    Blues
    <input
      type="radio"
      name="genre"
      value="blues"
      onChange={handleRadio}
    />
  </label>
  <label className='genre-classical'>
    Clásica
    <input
      type="radio"
      name="genre"
      value="classical"
      onChange={handleRadio}
    />
  </label>
  <label className='genre-samba'>
    Samba
    <input
      type="radio"
      name="genre"
      value="samba"
      onChange={handleRadio}
    />
  </label>
</form>
}



function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState('');

  const [recommendation, setRecommendation] = useState(null);

  const [genre, setGenre] = useState(null);
  const [artist, setArtist] = useState(null);
  const [watching, setWatching] = useState('start');

  const { isLoading: byGenre } = useQuery(
    ['songsByGenre', genre],
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
          url: data.tracks[0].external_urls.spotify
        };

        setRecommendation(cleanData);
      },
      enabled: !!token && !!genre,
    }
  );

  const { isLoading: byArtist } = useQuery(
    ['songsByArtist', artist],
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
        console.log(data, 'de artistas');

        const cleanData = {
          artist: data.tracks[0].artists[0].name,
          name: data.tracks[0].name,
          image: data.tracks[0].album.images[1].url,
          url: data.tracks[0].external_urls.spotify
        };

        setRecommendation(cleanData);
      },
      enabled: !!token && !!artist,
    }
  );

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    console.log(hash, token);

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      console.log(token);

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const handleSelect = (ev) => {
    const value = ev.target.value;
    console.log(value);
    setArtist(value)
  }


  const handleRadio = (ev) => {
    const value = ev.target.value;
    console.log(value);
    setGenre(value);
  };


  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Bajo mil</h1>
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
        <nav className='menu'>
          <a className='menu-artist' onClick={() => setWatching('artist')}>Por artista</a>
          <a className='menu-genre' onClick={() => setWatching('genre')}>Por género</a>
        </nav>
      </header>
      <main>
        {watching === 'start' && <StartWelcome/>}
        {watching === 'artist' && <ArtistForm handleSelect={handleSelect}/>}
        {watching === 'genre' && <GenreForm handleRadio={handleRadio}/>}
        {genre && byGenre  && <p>Carrrrgaannndo que es geruuuuundioooo</p>}

        {recommendation && !byGenre && (
          <div className="recommendation">
            <p>Échale un oído a</p>
            <p>{recommendation.name}</p>
            <p>{recommendation.artist}</p>
            <img
              alt={`It's ${recommendation.name} by ${recommendation.artist}`}
              src={recommendation.image}
              className="recommendation-img"
            />
            <a href={recommendation.url} target='_blank'>Escúchala aquí</a>
          </div>
        )}
        {artist && byArtist  && <p>Carrrrgaannndo que es geruuuuundioooo</p>}

        {recommendation && !byArtist && (
          <div className="recommendation">
            <p>Échale un oído a</p>
            <p>{recommendation.name}</p>
            <p>{recommendation.artist}</p>
            <img
              alt={`It's ${recommendation.name} by ${recommendation.artist}`}
              src={recommendation.image}
              className="recommendation-img"
            />
            <a href={recommendation.url} target='_blank'>Escúchala aquí</a>
          </div>
        )}  
      </main>
      <footer className="footer">
        <p>By Ro Flo :)</p>
      </footer>
    </div>
  );
}

export default App;
