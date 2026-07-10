const navItems = [
  ["overview", "Overview"],
  ["players", "Players"],
  ["matches", "Matches"],
  ["compositions", "Compositions"],
  ["goals", "Goals"],
  ["notes", "Coach Notes"]
] as const;

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-mark" aria-label="CAD Earth logo">
          <span>C</span><span>A</span><span>D</span>
        </div>
        <div><strong>CAD</strong><small>EARTH // TEAM OPS</small></div>
      </div>
      <nav className="nav" aria-label="Primary navigation">
        {navItems.map(([view, label]) => (
          <button key={view} className={`nav-link ${activeView === view ? "active" : ""}`} onClick={() => onViewChange(view)}>{label}</button>
        ))}
      </nav>
      <div className="scrim-card"><span className="eyebrow">NEXT EVENT</span><h3>Amateur Tournament</h3><p>Schedule pending</p><div className="status-row"><span className="status-dot" /> Preparation mode</div></div>
      <div className="riot-note">CAD Earth is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in League of Legends.</div>
    </aside>
  );
}
