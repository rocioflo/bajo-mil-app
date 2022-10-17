export default function Recommendation({
  recommendation,
  byGenre,
  byArtist,
  artist,
  genre,
  errorMessage,
}) {
  return (
    <>
      {genre && byGenre && <p>Carrrrgaannndo que es geruuuuundioooo</p>}

      {artist && byArtist && <p>Carrrrgaannndo que es geruuuuundioooo</p>}

      {errorMessage === "error" && (
        <p>Busca otro artista, que este funciona raro</p>
      )}

      {recommendation && (!byArtist || !byGenre) && errorMessage !== "error" && (
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
