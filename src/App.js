import './styles/App.scss';
import CallToApi from './services/api';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function ArtistForm() {
  return <form className="first-form">
          <label className="first-form-label">
            Selecciona un artista que le hable a tu alma
            <select>
              <option>Taylor Swift</option>
              <option>Dodie</option>
              <option>Sammy Rae & The Friends</option>
            </select>
          </label>
          <input type="submit" value="Dale" className="first-form-button" />
        </form>
}

function renderGenreForm() {
  return 
}


function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState('');

  const [recommendation, setRecommendation] = useState(null);

  const [genre, setGenre] = useState(null);
  const [watching, setWatching] = useState('artist')

  const { isLoading } = useQuery(
    ['songs', genre],
    () => {
      return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=5&target_popularity=10`,
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
        };

        setRecommendation(cleanData);
      },
      enabled: !!token && !!genre,
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

  const [trackInfo, setTrackInfo] = useState({
    artist: '',
    name: '',
    genre: '',
    image: '',
  });


  const handleSearch = (ev) => {
    ev.preventDefault();
    CallToApi(token);
  };

  const handleRadio = (ev) => {
    const value = ev.target.value;
    console.log(value);

    setGenre(value);

    // CallToApi(token, value);
  };


  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Bajo mil</h1>
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify eh
        </a>
        <nav className='menu'>
          <a className='menu-artist' onClick={() => setWatching('artist')}>Por artista</a>
          <a className='menu-genre' onClick={() => setWatching('genre')}>Por género</a>
        </nav>
      </header>
      <main>
        {watching === 'artist' && <ArtistForm/>}
        <form className="second-form">
          <label className="second-form-label">O selecciona un género</label>
          <label className='genre-pop'>
            Pop
            <input
              type="radio"
              name="genre"
              value="pop"
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
          {/* <input type="submit" value="Niiice" className="second-form-button" /> */}
        </form>
        {/* <button onClick={handleSearch}>Busca</button> */}
        {genre && isLoading && <p>Carrrrgaannndo que es geruuuuundioooo</p>}

        {recommendation && !isLoading && (
          <div className="recommendation">
            <p>Échale un oído a</p>
            <p>{recommendation.name}</p>
            <p>{recommendation.artist}</p>
            <img
              alt={`It's ${recommendation.name} by ${recommendation.artist}`}
              src={recommendation.image}
              className="recommendation-img"
            />
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
