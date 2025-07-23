import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Disclosure, Menu, Transition, Popover } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { NotificationBell } from "../notifications/NotificationSystem";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for transparent to blur background transition
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Main navigation categories similar to Visit Iceland
  const navigationCategories = [
    {
      name: "About Pakistan",
      items: [
        { name: "Safe Travel", href: "/safe-travel" },
        { name: "Visa Information", href: "/visa-info" },
        { name: "Geography of Pakistan", href: "/geography" },
        { name: "General Information", href: "/info" },
        { name: "Weather & Seasons", href: "/weather" },
        { name: "Regulations & Culture Hub", href: "/regulations-culture" },
      ],
    },
    {
      name: "Plan Your Trip",
      items: [
        { name: "Itinerary Planner", href: "/itinerary-planner" },
        { name: "My Itineraries", href: "/itineraries" },
        { name: "Download Maps", href: "/download-maps" },
        { name: "Offline Maps", href: "/offline-maps" },
        { name: "Turn-by-Turn Navigation", href: "/turn-by-turn-navigation" },
        { name: "Getting Around", href: "/how-to-get-there" },
      ],
    },
    {
      name: "Destinations",
      items: [
        { name: "The Regions", href: "/destinations" },
        { name: "Scenic Routes", href: "/scenic-routes" },
        { name: "National Parks", href: "/national-parks" },
      ],
    },
    {
      name: "Inspiration",
      items: [
        { name: "Adventure", href: "/adventure" },
        { name: "Culture", href: "/culture" },
        { name: "Wellness", href: "/wellness" },
        { name: "Food and Beverages", href: "/food" },
        { name: "Sustainable Travel", href: "/sustainable-travel" },
        { name: "Events", href: "/events" },
      ],
    },
  ];

  // Simple navigation for mobile - commented out as it's not currently used
  // const mobileNavigation = [
  //   { name: "Home", href: "/" },
  //   { name: "Destinations", href: "/destinations" },
  //   { name: "Vacations", href: "/vacations" },
  //   { name: "Community Forum", href: "/forum" },
  //   { name: "Regulations & Culture Hub", href: "/regulations-culture" },
  //   { name: "My Profile", href: "/profile" },
  //   { name: "My Transport Bookings", href: "/transport-bookings" },
  //   { name: "Itinerary Planner", href: "/itinerary-planner" },
  //   { name: "My Itineraries", href: "/itineraries" },
  //   { name: "Download Maps", href: "/download-maps" },
  //   { name: "Offline Maps", href: "/offline-maps" },
  //   { name: "Turn-by-Turn Navigation", href: "/turn-by-turn-navigation" },
  //   { name: "About Us", href: "/about" },
  //   { name: "Contact", href: "/contact" },
  // ];

  const userNavigation = [
    { name: "Your Profile", href: "/profile" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Community Forum", href: "/forum" },
    { name: "Itinerary Planner", href: "/itinerary-planner" },
    { name: "My Itineraries", href: "/itineraries" },
    { name: "My Transport Bookings", href: "/transport-bookings" },
    { name: "Download Maps", href: "/download-maps" },
    { name: "Offline Maps", href: "/offline-maps" },
  ];

  // Add tour guide specific links
  if (user?.role === "tourGuide") {
    userNavigation.push(
      { name: "Tour Guide Dashboard", href: "/tour-guide/dashboard" },
      { name: "Submit Package", href: "/tour-guide/submit-package" },
      { name: "My Submissions", href: "/tour-guide/my-submissions" }
    );
  }

  // Add admin specific links
  if (user?.role === "admin") {
    userNavigation.push(
      { name: "Admin Dashboard", href: "/admin/dashboard" },
      { name: "Pending Packages", href: "/admin/pending-packages" }
    );
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      {/* Main navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-soft"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img
                  src="/logo.png"
                  alt="Aurora Voyages"
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigationCategories.map((category) => (
                <Popover key={category.name} className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-primary-600" : "text-neutral-800",
                          "group inline-flex items-center px-2 py-4 text-sm font-medium hover:text-primary-600 focus:outline-none transition-colors duration-200"
                        )}
                        onMouseEnter={() => setActiveMenu(category.name)}
                      >
                        <span>{category.name}</span>
                        <ChevronDownIcon
                          className={classNames(
                            open
                              ? "text-primary-600 rotate-180"
                              : "text-neutral-400",
                            "ml-1 h-4 w-4 group-hover:text-primary-600 transition-transform duration-200"
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        show={open || activeMenu === category.name}
                        onMouseLeave={() => setActiveMenu(null)}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          static
                          className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-2"
                          onMouseEnter={() => setActiveMenu(category.name)}
                        >
                          <div className="rounded-2xl shadow-elevated overflow-hidden backdrop-blur-md bg-white/90">
                            <div className="relative flex flex-col p-4">
                              {category.items.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className="flex items-center px-4 py-2.5 rounded-xl transition duration-200 ease-in-out hover:bg-primary-50 focus:outline-none"
                                >
                                  <span className="text-sm text-neutral-700 hover:text-primary-600">
                                    {item.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))}

              {/* Community Forum */}
              <Link
                to="/forum"
                className="px-2 py-4 text-sm font-medium text-neutral-800 hover:text-primary-600 transition-colors duration-200"
              >
                Community Forum
              </Link>

              {/* Notification Bell - Only show when authenticated */}
              {isAuthenticated && (
                <div className="ml-4">
                  <NotificationBell />
                </div>
              )}

              {/* User menu */}
              <div className="ml-4">
                {isAuthenticated ? (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex items-center text-sm font-medium text-neutral-700 hover:text-primary-600 focus:outline-none transition-colors duration-200">
                        <span className="sr-only">Open user menu</span>
                        {user?.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover shadow-sm"
                            onError={(e) => {
                              console.log(
                                "Profile image failed to load:",
                                user.picture
                              );
                              e.target.onerror = null;
                              e.target.src = "/images/default_profile.svg";
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white/95 backdrop-blur-md py-2 shadow-elevated rounded-2xl focus:outline-none">
                        <div className="px-5 py-3 text-sm text-neutral-700 border-b border-neutral-200">
                          <p className="font-medium text-base">{user?.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {user?.email}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5 capitalize">
                            {user?.role}
                          </p>
                        </div>
                        <div className="py-1">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.href}
                                  className={classNames(
                                    active ? "bg-neutral-100" : "",
                                    "block px-5 py-2.5 text-sm text-neutral-700 hover:text-primary-600 transition-colors duration-150"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                        <div className="py-1 border-t border-neutral-200">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  logout();
                                  navigate("/login");
                                }}
                                className={classNames(
                                  active ? "bg-neutral-100" : "",
                                  "block w-full text-left px-5 py-2.5 text-sm text-neutral-700 hover:text-red-600 transition-colors duration-150"
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex space-x-4 items-center">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-neutral-700 hover:text-primary-600 px-2 py-4 transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary py-2.5 px-5 text-sm"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 text-neutral-700 hover:text-primary-600 focus:outline-none transition-colors duration-200">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>

                    <Disclosure.Panel className="absolute top-20 inset-x-0 z-10 bg-white/95 backdrop-blur-md shadow-elevated rounded-b-2xl">
                      {/* Mobile navigation categories */}
                      <div className="pt-3 pb-3">
                        {navigationCategories.map((category) => (
                          <Disclosure key={category.name}>
                            {({ open: categoryOpen }) => (
                              <>
                                <Disclosure.Button className="flex w-full justify-between px-5 py-3 text-left text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-primary-600 transition-colors duration-150">
                                  <span>{category.name}</span>
                                  <ChevronDownIcon
                                    className={`${
                                      categoryOpen ? "rotate-180 transform" : ""
                                    } h-5 w-5 text-neutral-400 transition-transform duration-200`}
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel className="bg-neutral-50">
                                  {category.items.map((item) => (
                                    <Link
                                      key={item.name}
                                      to={item.href}
                                      className="block px-8 py-2.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-150"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        ))}
                      </div>

                      <div className="border-t border-neutral-200 pt-4 pb-4">
                        {isAuthenticated ? (
                          <>
                            <div className="flex items-center px-5">
                              <div className="flex-shrink-0">
                                {user?.picture ? (
                                  <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="h-12 w-12 rounded-full object-cover shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "/images/default_profile.svg";
                                    }}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-medium text-neutral-800">
                                  {user?.name}
                                </div>
                                <div className="text-sm text-neutral-500">
                                  {user?.email}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 space-y-1 px-3">
                              {userNavigation.map((item) => (
                                <Disclosure.Button
                                  key={item.name}
                                  as={Link}
                                  to={item.href}
                                  className="block w-full px-5 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 rounded-xl transition-colors duration-150"
                                >
                                  {item.name}
                                </Disclosure.Button>
                              ))}
                              <Disclosure.Button
                                as="button"
                                onClick={() => {
                                  logout();
                                  navigate("/login");
                                }}
                                className="block w-full text-left px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-red-600 rounded-xl transition-colors duration-150"
                              >
                                Sign out
                              </Disclosure.Button>
                            </div>
                          </>
                        ) : (
                          <div className="mt-3 space-y-3 px-5 pb-2">
                            <Disclosure.Button
                              as={Link}
                              to="/login"
                              className="block w-full px-5 py-3 text-sm text-center font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 rounded-xl border border-neutral-200 transition-colors duration-150"
                            >
                              Sign in
                            </Disclosure.Button>
                            <Disclosure.Button
                              as={Link}
                              to="/register"
                              className="block w-full px-5 py-3 text-sm text-center font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors duration-150"
                            >
                              Sign up
                            </Disclosure.Button>
                          </div>
                        )}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
