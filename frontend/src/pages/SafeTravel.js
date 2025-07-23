import React from "react";
import AboutPakistanLayout from "../components/layout/AboutPakistanLayout";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const SafeTravel = () => {
  // Safety tips for travelers
  const safetyTips = [
    {
      title: "Register with your embassy",
      description:
        "Before traveling to Pakistan, register with your country's embassy or consulate. This ensures they can contact you in case of emergency.",
      icon: <ShieldCheckIcon className="h-6 w-6 text-primary-600" />,
    },
    {
      title: "Purchase travel insurance",
      description:
        "Comprehensive travel insurance that covers medical emergencies, evacuation, and trip cancellation is essential for travel to Pakistan.",
      icon: <ShieldCheckIcon className="h-6 w-6 text-primary-600" />,
    },
    {
      title: "Research your destinations",
      description:
        "Some areas of Pakistan have travel advisories. Check your government's travel advice and research the current situation in areas you plan to visit.",
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Keep digital copies of documents",
      description:
        "Store digital copies of your passport, visa, insurance policy, and other important documents in a secure cloud storage service.",
      icon: <ShieldCheckIcon className="h-6 w-6 text-primary-600" />,
    },
    {
      title: "Stay connected",
      description:
        "Purchase a local SIM card upon arrival for affordable data and calls. Keep emergency contacts easily accessible.",
      icon: <PhoneIcon className="h-6 w-6 text-primary-600" />,
    },
    {
      title: "Respect local customs",
      description:
        "Familiarize yourself with local customs and dress codes. Modest dress is appreciated, especially in rural areas and religious sites.",
      icon: <ShieldCheckIcon className="h-6 w-6 text-primary-600" />,
    },
  ];

  // Emergency contacts
  const emergencyContacts = [
    { service: "Police Emergency", number: "15" },
    { service: "Ambulance", number: "1122" },
    { service: "Fire Brigade", number: "16" },
    { service: "Tourist Police (Islamabad)", number: "+92-51-9272616" },
    { service: "Tourist Police (Lahore)", number: "+92-42-99204848" },
    { service: "Tourist Police (Karachi)", number: "+92-21-99204848" },
  ];

  return (
    <AboutPakistanLayout
      title="Safe Travel in Pakistan"
      subtitle="Essential safety information and tips for a secure journey"
      heroImage="https://images.unsplash.com/photo-1586325194227-7625ed95172b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Traveling Safely in Pakistan
        </h2>
        <p className="text-gray-600 mb-6">
          Pakistan offers incredible experiences for travelers, from stunning
          mountain landscapes to rich cultural heritage. While most visits to
          Pakistan are trouble-free, it's important to stay informed and take
          common-sense precautions to ensure a safe and enjoyable trip.
        </p>
      </div>

      {/* Safety Tips Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Essential Safety Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyTips.map((tip, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">{tip.icon}</div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {tip.title}
                  </h4>
                  <p className="mt-2 text-gray-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <PhoneIcon className="h-6 w-6 mr-2 text-red-600" />
          Emergency Contacts
        </h3>
        <p className="text-gray-600 mb-6">
          Save these important emergency numbers before your trip to Pakistan:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <p className="font-medium text-gray-900">{contact.service}</p>
              <p className="text-primary-600 font-bold">{contact.number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health and Medical */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Health & Medical Information
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Medical Facilities
          </h4>
          <p className="text-gray-600 mb-4">
            Major cities like Islamabad, Lahore, and Karachi have good quality
            medical facilities, but services may be limited in rural areas. It's
            advisable to carry a basic medical kit for minor ailments.
          </p>

          <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">
            Vaccinations
          </h4>
          <p className="text-gray-600 mb-4">
            Consult your healthcare provider at least 4-6 weeks before your trip
            to check if you need any vaccinations. Hepatitis A and Typhoid
            vaccines are generally recommended for most travelers to Pakistan.
          </p>

          <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">
            Water and Food Safety
          </h4>
          <p className="text-gray-600">
            Drink only bottled or purified water. Avoid ice in drinks unless
            you're sure it's made from purified water. Eat thoroughly cooked
            food and avoid raw vegetables and fruits that cannot be peeled.
          </p>
        </div>
      </div>

      {/* Regional Safety Information */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <MapPinIcon className="h-6 w-6 mr-2 text-primary-600" />
          Regional Safety Information
        </h3>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900">
              Northern Areas (Gilgit-Baltistan)
            </h4>
            <p className="text-gray-600 mt-2">
              Generally safe for tourists, but check weather conditions before
              traveling, especially in winter. Some remote areas may require
              special permits. Always travel with a local guide when trekking.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900">Major Cities</h4>
            <p className="text-gray-600 mt-2">
              Islamabad, Lahore, and Karachi are generally safe for tourists.
              Take normal precautions against petty theft in crowded areas and
              markets. Use reputable taxi services or ride-hailing apps for
              transportation.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900">
              Border Regions
            </h4>
            <p className="text-gray-600 mt-2">
              Some border areas have travel restrictions. Always check the
              latest travel advisories before planning your trip and obtain any
              necessary permits for restricted areas.
            </p>
          </div>
        </div>
      </div>

      {/* Best Time to Visit */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <ClockIcon className="h-6 w-6 mr-2 text-primary-600" />
          Best Time to Visit
        </h3>
        <p className="text-gray-600 mb-6">
          The best time to visit Pakistan depends on the regions you plan to
          explore:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900">
              Northern Areas
            </h4>
            <p className="text-gray-600 mt-2">
              May to October is ideal for visiting the northern mountainous
              regions. The Karakoram Highway is usually open, and the weather is
              pleasant for trekking and sightseeing.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900">
              Southern Regions
            </h4>
            <p className="text-gray-600 mt-2">
              October to March is the best time to visit southern Pakistan,
              including Karachi and the coastal areas, when temperatures are
              moderate and comfortable.
            </p>
          </div>
        </div>
      </div>
    </AboutPakistanLayout>
  );
};

export default SafeTravel;
