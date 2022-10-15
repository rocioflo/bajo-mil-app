import './styles/App.scss';
import CallToApi from './services/api';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Buffer } from 'buffer';


function StartWelcome() {
  return <div>¡Bienvenide! Musiquita para todes :)</div>
}

// function ArtistForm({handleSelect}) {
//   return <form className="first-form">
//           <label className="first-form-label">
//             Selecciona un artista que le hable a tu alma
//             <select className='first-form-select' onChange={handleSelect}>
//               <option value='06HL4z0CvFAxyc27GXpf02'>Taylor Swift</option>
//               <option value='21TinSsF5ytwsfdyz5VSVS'>Dodie</option>
//               <option value='3lFDsTyYNPQc8WzJExnQWn'>Sammy Rae & The Friends</option>
//               <option value='6flBUmmOMLNhD4EJhGwgpG'>Camela</option>
//             </select>
//           </label>
//           <input type="submit" value="Dale" className="first-form-button" />
//         </form>
// }

function ArtistCall({handleSelect, handleFilter, filteredData, filter, artistList}) {
  return  <form className='first-form'>
          <label className='first-form-label'>
          Dime un artista que le hable a tu alma
          <input className='first-form-input' type='text' placeholder='Taylor Swift...' onChange={handleFilter} value={filter}/>
            {artistList === 'see' && <ArtistList filteredData={filteredData} handleSelect={handleSelect}/>}
          </label>
          </form>
}

function ArtistList({filteredData, handleSelect}) {
  const filterList = filteredData.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)

  return <select className='first-form-select'   onChange={handleSelect}>
          <option selected disabled>Elige aquí</option>
            {filterList}
            </select>
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

function Recommendation({recommendation, byGenre, byArtist, artist, genre}) {
    return <>{genre && byGenre  && <p>Carrrrgaannndo que es geruuuuundioooo</p>}
              
              {artist && byArtist  && <p>Carrrrgaannndo que es geruuuuundioooo</p>}
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
                  <a href={recommendation.url} target='_blank' rel='noreferrer'>Escúchala aquí</a>
                </div>
              )}</>
}

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState('');

  const [recommendation, setRecommendation] = useState(null);

  const [genre, setGenre] = useState(null);
  const [artist, setArtist] = useState(null);
  const [watching, setWatching] = useState('start');
  const [artistList, setArtistList] = useState('')
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);


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

  const { isLoading: searchArtist } = useQuery(['artistFilter', filter], () => {
    return axios.get(`https://api.spotify.com/v1/search?q=${filter}&type=artist`,  {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    )
  },
  {
    onSuccess: ({data}) => {
      setFilteredData(data.artists.items);
      console.log(filteredData)
    },
    enabled: !!filter
  }
  );

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);


  // const getToken = useMutation(['token'], () => { 
  //   axios.post('https://accounts.spotify.com/api/token', {
  //   headers: { 
  //     'Authorization' : 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
  //     'Content-Type' : 'application/x-www-form-urlencoded'
  //    },
  //   body: JSON.stringify( { grant_type: 'client_credentials' } ),
  //   json: true})
  // })


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

  const handleFilter = (ev) => {
    setFilter(ev.target.value)
    setArtistList('see')
  }

  return (
    <div className="App">
      <header className="header">
        <a className="title" href={REDIRECT_URI}>Bajo mil</a>
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
        {watching === 'artist' && <ArtistCall handleSelect={handleSelect} handleFilter={handleFilter} filteredData={filteredData} filter={filter} artistList={artistList}/>}
        {watching === 'genre' && <GenreForm handleRadio={handleRadio}/>}
        
        <Recommendation recommendation={recommendation} byArtist={byArtist} byGenre={byGenre} artist={artist} genre={genre}/> 
      </main>
      <footer className="footer">
        <p>By Ro Flo :)</p>
        {/* <button onClick={getToken.mutate}>Token time</button>
        {getToken.isError? (<div>Error</div>) : getToken.isLoading ? (<div>Loading</div>) : getToken.isIdle ? (<div>Idle</div>) : null} */}
      </footer>
    </div>
  );
}

export default App;
