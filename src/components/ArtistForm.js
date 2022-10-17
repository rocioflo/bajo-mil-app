import ArtistList from "./ArtistList";

export default function ArtistForm({
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
