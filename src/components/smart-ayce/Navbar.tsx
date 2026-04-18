import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#problem", label: "Latar Belakang" },
  { href: "#methodology", label: "Metodologi" },
  { href: "#features", label: "Fitur" },
  { href: "#insights", label: "Insight" },
];

export const Navbar = () => (
  <header className="fixed top-0 inset-x-0 z-50">
    <div className="container mx-auto px-4 py-4">
      <nav className="glass rounded-2xl flex items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-warm grid place-items-center shadow-glow">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold tracking-tight text-lg">
            Smart<span className="text-gradient-warm">-AYCE</span>
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Button asChild className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow">
          <Link to="/analyze">Coba Analyzer</Link>
        </Button>
      </nav>
    </div>
  </header>
);
