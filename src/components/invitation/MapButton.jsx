export default function MapButton({ href }) {
  if (!href) return null;
  return (
    <a className="inv-map-btn" href={href} target="_blank" rel="noopener noreferrer">
      Google Maps&#8217;da ochish
    </a>
  );
}
