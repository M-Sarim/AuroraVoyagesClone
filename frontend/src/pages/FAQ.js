import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const FAQ = () => {
  // FAQ categories
  const categories = [
    { id: "general", name: "General Information" },
    { id: "booking", name: "Booking & Reservations" },
    { id: "travel", name: "Travel & Transportation" },
    { id: "safety", name: "Safety & Security" },
    { id: "visa", name: "Visa & Documentation" },
  ];

  // FAQ items organized by category
  const faqItems = {
    general: [
      {
        question: "What is Aurora Voyages?",
        answer:
          "Aurora Voyages is a premier travel platform dedicated to showcasing the beauty and cultural richness of Pakistan. We offer curated travel experiences, vacation packages, and comprehensive travel information to help tourists explore Pakistan safely and conveniently.",
      },
      {
        question: "What destinations in Pakistan do you cover?",
        answer:
          "We cover all major tourist destinations across Pakistan, including the northern areas (Gilgit-Baltistan, Hunza, Skardu), major cities (Islamabad, Lahore, Karachi), coastal areas, historical sites, and cultural landmarks. Our platform provides detailed information about each destination to help you plan your perfect trip.",
      },
      {
        question: "What services does Aurora Voyages offer?",
        answer:
          "Aurora Voyages offers a comprehensive range of travel services including vacation packages, tour guide bookings, transportation arrangements, itinerary planning, offline maps, cultural information, and travel requirements guidance. We aim to be your one-stop solution for all travel needs in Pakistan.",
      },
      {
        question: "Is Pakistan safe for tourists?",
        answer:
          "Yes, Pakistan has become increasingly safe for tourists in recent years. The security situation has improved significantly, and the government has implemented special measures to ensure tourist safety. We provide up-to-date safety information for all destinations and recommend following local guidelines and staying informed about the areas you plan to visit.",
      },
    ],
    booking: [
      {
        question: "How do I book a vacation package?",
        answer: `To book a vacation package, browse our available packages on the Vacation Packages page, select the one that interests you, review the details, and click "Book Now." Follow the prompts to select your dates, provide necessary information, and complete the payment process. You'll receive a confirmation email with all the details of your booking.`,
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For certain destinations, we also offer cash payment options upon arrival, though this requires prior arrangement.",
      },
      {
        question: "Can I customize a vacation package?",
        answer: `Yes, many of our vacation packages can be customized to suit your preferences. Contact our customer service team with your requirements, and we'll work with you to create a personalized itinerary that meets your needs and interests.`,
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "Our cancellation policy varies depending on the package and service. Generally, cancellations made 30 days or more before the scheduled trip receive a full refund minus a processing fee. Cancellations made 15-29 days before receive a 50% refund, and those made less than 15 days before are non-refundable. Please check the specific terms for each booking.",
      },
    ],
    travel: [
      {
        question: "What transportation options are available in Pakistan?",
        answer:
          "Pakistan offers various transportation options including domestic flights, trains, buses, and car rentals. Major cities have public transportation systems, and ride-sharing services are available in urban areas. For remote destinations, specialized transport services or guided tours may be necessary. Our platform provides information on the best transportation methods for each destination.",
      },
      {
        question:
          "Do I need a special permit to visit certain areas in Pakistan?",
        answer:
          "Yes, some areas in Pakistan require special permits for foreign tourists, particularly in certain parts of Gilgit-Baltistan and along border regions. Our destination guides specify which areas require permits and how to obtain them. We can assist with the permit application process for our package customers.",
      },
      {
        question: "What is the best time to visit Pakistan?",
        answer:
          "The best time to visit Pakistan depends on the regions you plan to explore. Generally, spring (March to May) and autumn (September to November) offer pleasant weather across most of the country. Northern areas are best visited from May to October, while southern regions are more comfortable from November to February. Our Weather & Seasons page provides detailed information for each region.",
      },
      {
        question: "How reliable is internet connectivity in Pakistan?",
        answer:
          "Internet connectivity is generally good in major cities and tourist areas, with 4G services widely available. However, in remote mountain regions, connectivity can be limited or intermittent. We recommend downloading our offline maps and essential information before traveling to remote areas. Many hotels and restaurants in tourist areas offer Wi-Fi.",
      },
    ],
    safety: [
      {
        question:
          "What safety precautions should I take while traveling in Pakistan?",
        answer:
          "We recommend standard travel precautions: keep copies of important documents, stay informed about local conditions, respect local customs and dress codes, avoid isolated areas at night, and maintain communication with someone about your whereabouts. Our Safe Travel page provides comprehensive safety guidelines for different regions of Pakistan.",
      },
      {
        question: "Are there any areas in Pakistan that tourists should avoid?",
        answer:
          "While most tourist destinations in Pakistan are safe to visit, we recommend checking the latest travel advisories for specific regions. Some border areas and certain parts of Balochistan and Khyber Pakhtunkhwa may have security concerns. Our platform provides up-to-date information on areas that may require extra caution or should be avoided.",
      },
      {
        question: "What emergency services are available for tourists?",
        answer:
          "Pakistan has emergency services available through the national emergency number 1122. Major tourist destinations have police stations, hospitals, and tourist police. Our app includes emergency contact information for each region. For package customers, we provide 24/7 emergency assistance through our customer service hotline.",
      },
      {
        question: "Do I need travel insurance for Pakistan?",
        answer:
          "Yes, we strongly recommend comprehensive travel insurance that covers medical emergencies, trip cancellations, and adventure activities if applicable. Healthcare facilities in remote areas may be limited, so medical evacuation coverage is advisable for those planning to visit mountainous regions.",
      },
    ],
    visa: [
      {
        question: "How do I apply for a Pakistani visa?",
        answer:
          "Most foreign nationals require a visa to visit Pakistan. The country has introduced an e-Visa system for many nationalities, making the application process more convenient. Visit our Visa Information page for detailed guidance on visa requirements, application procedures, and processing times based on your nationality.",
      },
      {
        question: "What documents do I need for a Pakistani visa?",
        answer: `Typically, you'll need a valid passport with at least six months validity, completed visa application form, passport-sized photographs, proof of accommodation, return ticket, and sometimes a letter of invitation. Requirements may vary based on your nationality and visa type. Our Visa Information page provides specific requirements for different countries.`,
      },
      {
        question: "How long does it take to process a Pakistani visa?",
        answer:
          "E-Visa processing typically takes 7-10 business days, while traditional visa applications through embassies may take 2-4 weeks. Processing times can vary based on nationality, visa type, and current application volumes. We recommend applying well in advance of your planned travel dates.",
      },
      {
        question: "Can Aurora Voyages help with visa applications?",
        answer:
          "Yes, we provide visa assistance services for our customers. While we cannot guarantee visa approval, we can guide you through the application process, provide necessary documentation for your bookings, and offer letters of invitation when applicable. Contact our customer service for visa assistance.",
      },
    ],
  };

  const [activeCategory, setActiveCategory] = useState("general");

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero section */}
      <div className="relative bg-primary-900 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/pakistan_mountains.jpg"
            alt="Pakistan mountains"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Find answers to common questions about traveling in Pakistan and
            using Aurora Voyages services.
          </p>
        </div>
      </div>

      {/* FAQ content */}
      <div className="container-custom py-16">
        {/* Category tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 ${
                  activeCategory === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems[activeCategory].map((item, index) => (
              <Disclosure
                key={index}
                as="div"
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left text-gray-900 font-medium focus:outline-none">
                      <span>{item.question}</span>
                      <ChevronDownIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-5 h-5 text-primary-600 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-6 py-4 text-gray-600 border-t border-gray-100">
                      {item.answer}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer to your question, please contact our
            customer support team.
          </p>
          <a
            href="mailto:auroravoyagesinfo@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
