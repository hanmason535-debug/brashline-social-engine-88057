import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";

function toTitle(segment: string) {
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export const Breadcrumbs = () => {
  const location = useLocation();

  const segments = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const crumbs = parts.map((part, idx) => {
      const href = "/" + parts.slice(0, idx + 1).join("/");
      return { label: toTitle(part), href };
    });
    return crumbs;
  }, [location.pathname]);

  if (location.pathname === "/" || segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full px-4 py-2 text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/" className="hover:underline text-foreground">Home</Link>
        </li>
        {segments.map((seg, i) => (
          <li key={seg.href} className="flex items-center gap-2">
            <span className="opacity-60">/</span>
            {i === segments.length - 1 ? (
              <span aria-current="page" className="text-foreground">{seg.label}</span>
            ) : (
              <Link to={seg.href} className="hover:underline text-foreground">
                {seg.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
