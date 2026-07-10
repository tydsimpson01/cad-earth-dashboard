export function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar">
      <div><span className="eyebrow">CTRL // ALT // DEL</span><h1 id="page-title">{title}</h1></div>
      <div className="top-actions">
        <select id="range-select" aria-label="Match range" defaultValue="Last 20 Games">
          <option>Last 20 Games</option><option>Last 10 Games</option><option>Current Tournament</option>
        </select>
        <div className="mode-pill">PUBLIC VIEW</div>
      </div>
    </header>
  );
}
