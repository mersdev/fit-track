import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Profile } from "./components/Profile";
import { WorkoutPlanner } from "./components/WorkoutPlanner";
import { DumbbellIcon } from "./components/icons/EquipmentIcons";
import clsx from "clsx";

function NavLinks() {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Workouts",
    },
    {
      path: "/profile",
      label: "Profile",
    },
  ];

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={clsx(
            "px-3 py-1.5 text-sm font-medium transition-colors",
            "sm:text-base sm:px-4",
            location.pathname === item.path
              ? "text-primary-600 bg-primary-50"
              : "text-gray-600 hover:text-primary-500 hover:bg-gray-50"
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

function App() {
  return (
    <Router basename="/fit-track">
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header with Navigation */}
        <header className="bg-gray-50 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between px-3 sm:px-4 h-14 sm:h-16">
              {/* Logo */}
              <div className="flex items-center">
                <DumbbellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                <span className="ml-2 text-base sm:text-lg font-semibold text-gray-900">
                  FitTrack
                </span>
              </div>

              {/* Navigation Text */}
              <nav className="flex items-center gap-1 sm:gap-2">
                <NavLinks />
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto w-full flex-1 py-4 sm:py-6 px-3 sm:px-4">
          <Routes>
            <Route path="/" element={<WorkoutPlanner />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
