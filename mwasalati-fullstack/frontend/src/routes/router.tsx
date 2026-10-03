import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Home } from "../pages/Home";
import { RouteSelection } from "../pages/RouteSelection";
import { RouteDetail } from "../pages/RouteDetail";
import { Booking } from "../pages/Booking";
import { Ticket } from "../pages/Ticket";
import { Wallet } from "../pages/Wallet";
import { Profile } from "../pages/Profile";

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/routes", element: <RouteSelection /> },
      { path: "/routes/:routeId", element: <RouteDetail /> },
      { path: "/booking/:tripId", element: <Booking /> },
      { path: "/ticket/:bookingId", element: <Ticket /> },
      { path: "/wallet", element: <Wallet /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);
