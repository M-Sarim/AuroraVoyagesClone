import React, { useState } from "react";
import InspirationLayout from "../../components/inspiration/InspirationLayout";
import InspirationCard from "../../components/inspiration/InspirationCard";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Events = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeMonth, setActiveMonth] = useState("all");

  // Event categories
  const categories = [
    { id: "all", name: "All Events" },
    { id: "cultural", name: "Cultural Festivals" },
    { id: "religious", name: "Religious Celebrations" },
    { id: "sports", name: "Sports Events" },
    { id: "music", name: "Music Festivals" },
    { id: "food", name: "Food Festivals" },
  ];

  // Months for filtering
  const months = [
    { id: "all", name: "All Year" },
    { id: "jan", name: "January" },
    { id: "feb", name: "February" },
    { id: "mar", name: "March" },
    { id: "apr", name: "April" },
    { id: "may", name: "May" },
    { id: "jun", name: "June" },
    { id: "jul", name: "July" },
    { id: "aug", name: "August" },
    { id: "sep", name: "September" },
    { id: "oct", name: "October" },
    { id: "nov", name: "November" },
    { id: "dec", name: "December" },
  ];

  // Events data
  const events = [
    {
      id: 1,
      title: "Shandur Polo Festival",
      description:
        "Experience the world's highest polo tournament at Shandur Pass, where teams from Chitral and Gilgit compete in this traditional sport at an altitude of 3,700 meters.",
      image: "/shandur-festival.jpg",
      category: "sports",
      location: "Shandur Pass",
      month: "jul",
      date: "July 7-9, 2023",
      link: "/destinations",
      featured: true,
    },
    {
      id: 2,
      title: "Basant Kite Festival",
      description:
        "Join the colorful celebration of spring with kite flying competitions, music, and festivities. The sky fills with thousands of kites as people gather on rooftops to participate in this traditional event.",
      image: "/kite-festival.jpg",
      category: "cultural",
      location: "Lahore",
      month: "feb",
      date: "February 18-19, 2023",
      link: "/destinations",
    },
    {
      id: 3,
      title: "Chilam Joshi Festival",
      description:
        "Witness the unique cultural traditions of the Kalash people during this spring festival that celebrates the arrival of summer with dancing, singing, and traditional rituals.",
      image: "/kalash-valley-culture.jpg",
      category: "cultural",
      location: "Kalash Valley, Chitral",
      month: "may",
      date: "May 13-16, 2023",
      link: "/destinations",
    },
    {
      id: 4,
      title: "Eid al-Fitr Celebrations",
      description:
        "Experience the joyous celebrations marking the end of Ramadan, with special prayers, feasts, gift-giving, and community gatherings across the country.",
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "religious",
      location: "Nationwide",
      month: "apr",
      date: "April 21-23, 2023 (dates may vary)",
      link: "/destinations",
    },
    {
      id: 5,
      title: "Lahore Literary Festival",
      description:
        "Engage with renowned authors, poets, artists, and intellectuals at this premier cultural event featuring book launches, panel discussions, readings, and art exhibitions.",
      image:
        "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "cultural",
      location: "Lahore",
      month: "feb",
      date: "February 24-26, 2023",
      link: "/destinations",
    },
    {
      id: 6,
      title: "Karachi Eat Food Festival",
      description:
        "Indulge in Pakistan's largest food festival featuring hundreds of food stalls, cooking demonstrations, live music, and a celebration of the country's diverse culinary traditions.",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "food",
      location: "Karachi",
      month: "jan",
      date: "January 12-14, 2023",
      link: "/destinations",
    },
    {
      id: 7,
      title: "Lok Mela Folk Festival",
      description:
        "Immerse yourself in Pakistan's folk heritage with this vibrant festival showcasing traditional music, dance, crafts, and cuisine from all provinces and regions.",
      image:
        "https://images.unsplash.com/photo-1508025690966-2a9a1957da31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      category: "cultural",
      location: "Islamabad",
      month: "nov",
      date: "November 5-12, 2023",
      link: "/destinations",
    },
    {
      id: 8,
      title: "Coke Studio Live",
      description:
        "Experience Pakistan's groundbreaking music platform live in concert, featuring fusion performances that blend traditional and contemporary music styles.",
      image: "/coke-studio.jpg",
      category: "music",
      location: "Multiple Cities",
      month: "dec",
      date: "December 8-22, 2023",
      link: "/destinations",
    },
  ];

  // Filter events based on active category and month
  const filteredEvents = events.filter((event) => {
    const categoryMatch =
      activeFilter === "all" || event.category === activeFilter;
    const monthMatch = activeMonth === "all" || event.month === activeMonth;
    return categoryMatch && monthMatch;
  });

  return (
    <InspirationLayout
      title="Events & Festivals"
      subtitle="Experience Pakistan's vibrant cultural calendar throughout the year"
      heroImage="/kite-festival.jpg"
      category="events"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Celebrate Pakistan's Rich Cultural Calendar
        </h2>
        <p className="text-lg text-gray-600">
          Pakistan's calendar is filled with colorful festivals, cultural
          celebrations, and exciting events throughout the year. From
          traditional religious observances to modern music festivals, from
          ancient sporting competitions to contemporary food fairs, there's
          always something happening that offers insight into the country's
          diverse heritage and vibrant present.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900">Filter Events:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    activeFilter === category.id
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900">
            Filter by Month:
          </h3>
          <div className="flex flex-wrap gap-2">
            {months.map((month) => (
              <button
                key={month.id}
                onClick={() => setActiveMonth(month.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    activeMonth === month.id
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {month.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={event.featured ? "md:col-span-2" : ""}
            >
              <InspirationCard
                title={event.title}
                description={event.description}
                image={event.image}
                link={event.link}
                category={event.category}
                location={event.location}
                featured={event.featured}
              />
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to find events.
          </p>
        </div>
      )}

      {/* Event planning tips */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Tips for Attending Pakistani Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Check Dates in Advance
              </h4>
              <p className="mt-1 text-gray-600">
                Many religious festivals follow the lunar calendar, so dates may
                change each year. Always verify the exact dates before planning
                your trip.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Dress Appropriately
              </h4>
              <p className="mt-1 text-gray-600">
                Respect local customs by dressing modestly, especially for
                religious events. Consider wearing traditional Pakistani attire
                to fully immerse in the experience.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Book Accommodation Early
              </h4>
              <p className="mt-1 text-gray-600">
                Popular festivals attract many visitors, so book your
                accommodation well in advance, especially for events in smaller
                towns or remote areas.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Ask Before Photographing
              </h4>
              <p className="mt-1 text-gray-600">
                Always ask permission before taking photos, especially during
                religious ceremonies or when photographing individuals
                participating in events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </InspirationLayout>
  );
};

export default Events;
