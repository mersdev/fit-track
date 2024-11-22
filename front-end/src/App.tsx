import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { Profile } from "./components/Profile";
import { WorkoutPlanner } from "./components/WorkoutPlanner";
import { DumbbellIcon } from "./components/icons/EquipmentIcons";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { EmailConfirmation } from "./components/auth/EmailConfirmation";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuthContext } from "./contexts/AuthContext";
import clsx from "clsx";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileGuard } from "./components/ProfileGuard";

function NavLinks() {
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const navItems = [
    { path: "/", label: "Workout", icon: "💪" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  if (!user) return null;

  return (
    <nav className="flex items-center space-x-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={clsx(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.path
              ? "bg-primary-100 text-primary-700"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <span className="mr-1">{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </Link>
      ))}
      <button
        onClick={() => logout()}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="mr-1">🚪</span>
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </nav>
  );
}

function AppHeader() {
  const { user } = useAuthContext();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <DumbbellIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              FitTrack
            </span>
          </Link>
          <NavLinks />
        </div>
      </div>
    </header>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <DumbbellIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          FitTrack
        </h2>
      </div>
      {children}
    </div>
  );
}

function AppContent() {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <AppHeader />}
      <main className={clsx(user ? "py-10" : "")}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <WorkoutPlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileGuard>
                    <Profile />
                  </ProfileGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <LoginForm />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout>
                  <SignupForm />
                </AuthLayout>
              }
            />
            <Route
              path="/email-confirmation"
              element={
                <AuthLayout>
                  <EmailConfirmation />
                </AuthLayout>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename="/fit-track">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
