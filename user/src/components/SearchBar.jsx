const SearchIcon = ({ color = "#9ca3af" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchBar({ value, onChange, placeholder = "Cari produk di DASI...", variant = "nav" }) {
  const isHero = variant === "hero";

  const wrapStyle = {
    position: "relative",
    width: "100%",
  };

  const iconStyle = {
    position: "absolute",
    left: isHero ? 0 : 14,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    ...(isHero && { display: "none" }),
  };

  const inputStyle = isHero ? {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "15px 20px",
    fontSize: 15,
    fontFamily: "var(--font-body)",
    color: "var(--gray-700)",
    background: "transparent",
    width: "100%",
  } : {
    width: "100%",
    padding: "10px 18px 10px 42px",
    background: "var(--gray-100)",
    border: "1.5px solid transparent",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    color: "var(--gray-900)",
    outline: "none",
    transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
  };

  return (
    <div style={wrapStyle}>
      {!isHero && <span style={iconStyle}><SearchIcon /></span>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => {
          if (!isHero) {
            e.target.style.background = "#fff";
            e.target.style.borderColor = "var(--blue-muted)";
            e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
          }
        }}
        onBlur={e => {
          if (!isHero) {
            e.target.style.background = "var(--gray-100)";
            e.target.style.borderColor = "transparent";
            e.target.style.boxShadow = "none";
          }
        }}
      />
    </div>
  );
}
