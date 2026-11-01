import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const items = [
  { to: "/", key: "home" as const },
  { to: "/routes", key: "routes" as const },
  { to: "/wallet", key: "wallet" as const },
  { to: "/profile", key: "profile" as const },
];

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="sticky bottom-0 z-10 flex justify-around border-t border-brand-brown/10 bg-brand-white py-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `px-3 py-1 text-xs font-medium ${isActive ? "text-brand-gold" : "text-brand-brown/60"}`
          }
        >
          {t(`nav.${item.key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
