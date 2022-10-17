export default function GenreForm({ handleSelectGenre, genreList }) {
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
