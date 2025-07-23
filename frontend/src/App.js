import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/utils/ScrollToTop";
import BackToTopButton from "./components/ui/BackToTopButton";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import VacationPackages from "./pages/VacationPackages";
import VacationPackageDetail from "./pages/VacationPackageDetail";
import BookingForm from "./pages/BookingForm";
import BookingDetails from "./pages/BookingDetails";
import BookingCheckout from "./pages/BookingCheckout";
import ARNavigation from "./pages/ARNavigation";
import DownloadMapsPage from "./pages/DownloadMapsPage";
import OfflineMapsPage from "./pages/OfflineMapsPage";
import OfflineMapDetailPage from "./pages/OfflineMapDetailPage";
import NavigationPage from "./pages/NavigationPage";
import TurnByTurnNavigation from "./pages/TurnByTurnNavigation";
import HowToGetThere from "./pages/HowToGetThere";
import TransportDetails from "./pages/TransportDetails";
import TransportBookings from "./pages/TransportBookings";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import ItineraryList from "./pages/ItineraryList";
import ItineraryDetail from "./pages/ItineraryDetail";
import RegulationsCultureHub from "./pages/RegulationsCultureHub";
import Profile from "./pages/Profile";
import CesiumTest from "./pages/CesiumTest";
import ScenicRoutes from "./pages/ScenicRoutes";
import NationalParks from "./pages/NationalParks";

// About Pakistan Pages
import SafeTravel from "./pages/SafeTravel";
import VisaInfo from "./pages/VisaInfo";
import Geography from "./pages/Geography";
import GeneralInfo from "./pages/GeneralInfo";
import Weather from "./pages/Weather";
import TripSuggestions from "./pages/TripSuggestions";

// Inspiration Pages
import Adventure from "./pages/inspiration/Adventure";
import Culture from "./pages/inspiration/Culture";
import Wellness from "./pages/inspiration/Wellness";
import Food from "./pages/inspiration/Food";
import SustainableTravel from "./pages/inspiration/SustainableTravel";
import Events from "./pages/inspiration/Events";

// Legal & Support Pages
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Sitemap from "./pages/Sitemap";
import Cancellation from "./pages/Cancellation";

// Forum Components
import ForumHome from "./pages/forum/ForumHome";
import RegionForum from "./pages/forum/RegionForum";
import PostDetail from "./pages/forum/PostDetail";
import CreateEditPost from "./pages/forum/CreateEditPost";
import AllDiscussions from "./pages/forum/AllDiscussions";
import MyPosts from "./pages/forum/MyPosts";

// Tour Guide Components
import TourGuideRegister from "./pages/tourGuide/TourGuideRegister";
import TourGuideDashboard from "./pages/tourGuide/TourGuideDashboard";
import SubmitPackage from "./pages/tourGuide/SubmitPackage";
import MySubmissions from "./pages/tourGuide/MySubmissions";
import TourGuideBookings from "./pages/tourGuide/TourGuideBookings";

// Admin Components
import AdminDashboard from "./pages/admin/Dashboard";
import PendingPackages from "./pages/admin/PendingPackages";
import PendingPackageDetail from "./pages/admin/PendingPackageDetail";
import PendingTourGuides from "./pages/admin/PendingTourGuides";
import CulturalInfoManagement from "./pages/admin/CulturalInfoManagement";
import CulturalInfoForm from "./pages/admin/CulturalInfoForm";
import TravelRequirementsManagement from "./pages/admin/TravelRequirementsManagement";
import TravelRequirementForm from "./pages/admin/TravelRequirementForm";
import TransportManagement from "./pages/admin/TransportManagement";
import TransportForm from "./pages/admin/TransportForm";
import DestinationManagement from "./pages/admin/DestinationManagement";
import DestinationForm from "./pages/admin/DestinationForm";
import VacationPackageManagement from "./pages/admin/VacationPackageManagement";
import VacationPackageForm from "./pages/admin/VacationPackageForm";

// Auth Context
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/routing/PrivateRoute";
import AdminRoute from "./components/routing/AdminRoute";
import TourGuideRoute from "./components/routing/TourGuideRoute";

// Notifications
import {
  NotificationProvider,
  NotificationToast,
} from "./components/notifications/NotificationSystem";

// Layout wrapper component that conditionally renders the footer
function AppLayout() {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);

  // Paths where the footer should not be displayed
  const noFooterPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const shouldShowFooter = !noFooterPaths.includes(location.pathname);

  const handleCloseNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Navbar />
      <BackToTopButton />
      <main className="flex-grow pt-20">
        {/* Notification Toasts */}
        <div className="fixed bottom-6 right-6 z-50 space-y-4">
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => handleCloseNotification(notification.id)}
            />
          ))}
        </div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/vacations" element={<VacationPackages />} />
          <Route path="/vacations/:id" element={<VacationPackageDetail />} />
          <Route
            path="/regulations-culture"
            element={<RegulationsCultureHub />}
          />
          <Route
            path="/regulations-culture/:destinationId"
            element={<RegulationsCultureHub />}
          />

          {/* About Pakistan Routes */}
          <Route path="/safe-travel" element={<SafeTravel />} />
          <Route path="/visa-info" element={<VisaInfo />} />
          <Route path="/geography" element={<Geography />} />
          <Route path="/info" element={<GeneralInfo />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/trip-suggestions" element={<TripSuggestions />} />
          <Route
            path="/trip-suggestions/:regionName"
            element={<TripSuggestions />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/booking/new"
            element={
              <PrivateRoute>
                <BookingForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <PrivateRoute>
                <BookingForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <PrivateRoute>
                <BookingDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout/:id"
            element={
              <PrivateRoute>
                <BookingCheckout />
              </PrivateRoute>
            }
          />
          <Route path="/ar-navigation/:id" element={<ARNavigation />} />
          <Route path="/cesium-test" element={<CesiumTest />} />
          <Route
            path="/download-maps"
            element={
              <PrivateRoute>
                <DownloadMapsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/offline-maps"
            element={
              <PrivateRoute>
                <OfflineMapsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/offline-maps/:id"
            element={
              <PrivateRoute>
                <OfflineMapDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/navigation/:id"
            element={
              <PrivateRoute>
                <NavigationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/turn-by-turn-navigation"
            element={<TurnByTurnNavigation />}
          />
          <Route path="/how-to-get-there" element={<HowToGetThere />} />
          <Route path="/transport/:id" element={<TransportDetails />} />
          <Route
            path="/transport-bookings"
            element={
              <PrivateRoute>
                <TransportBookings />
              </PrivateRoute>
            }
          />
          <Route path="/scenic-routes" element={<ScenicRoutes />} />
          <Route path="/national-parks" element={<NationalParks />} />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Inspiration Routes */}
          <Route path="/adventure" element={<Adventure />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/food" element={<Food />} />
          <Route path="/sustainable-travel" element={<SustainableTravel />} />
          <Route path="/events" element={<Events />} />

          {/* Itinerary Routes */}
          <Route
            path="/itinerary-planner"
            element={
              <PrivateRoute>
                <ItineraryPlanner />
              </PrivateRoute>
            }
          />
          <Route
            path="/itineraries"
            element={
              <PrivateRoute>
                <ItineraryList />
              </PrivateRoute>
            }
          />
          <Route
            path="/itineraries/:id"
            element={
              <PrivateRoute>
                <ItineraryDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/itineraries/:id/edit"
            element={
              <PrivateRoute>
                <ItineraryPlanner />
              </PrivateRoute>
            }
          />

          {/* Tour Guide Routes */}
          <Route
            path="/tour-guide/register"
            element={
              <PrivateRoute>
                <TourGuideRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="/tour-guide/dashboard"
            element={
              <TourGuideRoute>
                <TourGuideDashboard />
              </TourGuideRoute>
            }
          />
          <Route
            path="/tour-guide/submit-package"
            element={
              <TourGuideRoute>
                <SubmitPackage />
              </TourGuideRoute>
            }
          />
          <Route
            path="/tour-guide/my-submissions"
            element={
              <TourGuideRoute>
                <MySubmissions />
              </TourGuideRoute>
            }
          />
          <Route
            path="/tour-guide/bookings"
            element={
              <TourGuideRoute>
                <TourGuideBookings />
              </TourGuideRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pending-packages"
            element={
              <AdminRoute>
                <PendingPackages />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pending-packages/:id"
            element={
              <AdminRoute>
                <PendingPackageDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pending-tour-guides"
            element={
              <AdminRoute>
                <PendingTourGuides />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/cultural-info"
            element={
              <AdminRoute>
                <CulturalInfoManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/cultural-info/new"
            element={
              <AdminRoute>
                <CulturalInfoForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/cultural-info/edit/:id"
            element={
              <AdminRoute>
                <CulturalInfoForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/travel-requirements"
            element={
              <AdminRoute>
                <TravelRequirementsManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/travel-requirements/new"
            element={
              <AdminRoute>
                <TravelRequirementForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/travel-requirements/edit/:id"
            element={
              <AdminRoute>
                <TravelRequirementForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transport"
            element={
              <AdminRoute>
                <TransportManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transport/new"
            element={
              <AdminRoute>
                <TransportForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transport/edit/:id"
            element={
              <AdminRoute>
                <TransportForm />
              </AdminRoute>
            }
          />

          {/* Destination Management Routes */}
          <Route
            path="/admin/destinations"
            element={
              <AdminRoute>
                <DestinationManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations/new"
            element={
              <AdminRoute>
                <DestinationForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations/edit/:id"
            element={
              <AdminRoute>
                <DestinationForm />
              </AdminRoute>
            }
          />

          {/* Vacation Package Management Routes */}
          <Route
            path="/admin/packages"
            element={
              <AdminRoute>
                <VacationPackageManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/packages/new"
            element={
              <AdminRoute>
                <VacationPackageForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/packages/edit/:id"
            element={
              <AdminRoute>
                <VacationPackageForm />
              </AdminRoute>
            }
          />

          {/* Forum Routes */}
          <Route path="/forum" element={<ForumHome />} />
          <Route path="/forum/all-discussions" element={<AllDiscussions />} />
          <Route path="/forum/region/:regionId" element={<RegionForum />} />
          <Route path="/forum/posts/:postId" element={<PostDetail />} />
          <Route
            path="/forum/new-post"
            element={
              <PrivateRoute>
                <CreateEditPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/forum/edit-post/:postId"
            element={
              <PrivateRoute>
                <CreateEditPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/forum/my-posts"
            element={
              <PrivateRoute>
                <MyPosts />
              </PrivateRoute>
            }
          />

          {/* Legal & Support Routes */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/cancellation" element={<Cancellation />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider
      clientId={
        process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"
      }
    >
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <AppLayout />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
