export default function ArtistList({ filteredData, handleSelectArtist }) {
  const filterList = filteredData.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  return (
    <select className="first-form-select" onChange={handleSelectArtist}>
      <option selected disabled>
        Elige aquí
      </option>
      {filterList}
    </select>
  );
}
