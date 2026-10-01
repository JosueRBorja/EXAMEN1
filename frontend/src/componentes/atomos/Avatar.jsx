export default function Avatar({ usuario, grande = false, pequeno = false }) {
  const clases = [
    "avatar",
    grande ? "avatar-grande" : "",
    pequeno ? "avatar-pequeno" : "",
  ].filter(Boolean).join(" ");

  return (
    <span className={clases} title={usuario.name}>
      {usuario.avatar_url ? (
        <img src={usuario.avatar_url} alt={`Foto de ${usuario.name}`} />
      ) : (
        usuario.name.charAt(0).toUpperCase()
      )}
    </span>
  );
}
