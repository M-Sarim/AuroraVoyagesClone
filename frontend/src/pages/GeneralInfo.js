import React from "react";
import AboutPakistanLayout from "../components/layout/AboutPakistanLayout";
import {
  InformationCircleIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "../utils/imageHelper";
import ImageFallback from "../components/ImageFallback";

const GeneralInfo = () => {
  // Basic facts about Pakistan
  const basicFacts = [
    { label: "Official Name", value: "Islamic Republic of Pakistan" },
    { label: "Capital", value: "Islamabad" },
    { label: "Largest City", value: "Karachi" },
    { label: "Population", value: "Approximately 235 million (2023 estimate)" },
    {
      label: "Area",
      value: "881,913 square kilometers (340,509 square miles)",
    },
    {
      label: "Official Languages",
      value: "Urdu (national), English (official)",
    },
    {
      label: "Regional Languages",
      value: "Punjabi, Sindhi, Pashto, Balochi, Saraiki, and others",
    },
    {
      label: "Religion",
      value: "Islam (96%), with Hindu, Christian, and other minorities",
    },
    { label: "Currency", value: "Pakistani Rupee (PKR)" },
    {
      label: "Government",
      value: "Federal parliamentary constitutional republic",
    },
    { label: "Independence", value: "August 14, 1947 (from British India)" },
    { label: "Time Zone", value: "Pakistan Standard Time (UTC+5)" },
    { label: "Driving Side", value: "Left" },
    { label: "Calling Code", value: "+92" },
    { label: "Internet TLD", value: ".pk" },
  ];

  // Major cities information
  const majorCities = [
    {
      name: "Karachi",
      description:
        "Pakistan's largest city and economic hub, located on the Arabian Sea. It's a diverse metropolis with a population of over 16 million, known for its bustling ports, financial centers, and vibrant cultural scene.",
      highlights: [
        "Financial capital of Pakistan",
        "Largest seaport",
        "Cultural diversity",
        "Historical sites including Quaid's Mausoleum",
      ],
      image: "/Karachi.jpg",
    },
    {
      name: "Lahore",
      description:
        "The cultural heart of Pakistan and capital of Punjab province. Known for its rich Mughal architecture, vibrant arts scene, and delicious cuisine. Lahore has a history spanning over a millennium.",
      highlights: [
        "Lahore Fort and Shalimar Gardens (UNESCO sites)",
        "Walled Old City",
        "Food capital of Pakistan",
        "Vibrant arts and literary scene",
      ],
      image: "/Lahore.jpeg",
    },
    {
      name: "Islamabad",
      description:
        "The capital city, designed in the 1960s as a planned city. Known for its organization, greenery, and modern infrastructure. Set against the backdrop of the Margalla Hills, it offers a contrast to Pakistan's other major urban centers.",
      highlights: [
        "Faisal Mosque - one of the largest mosques in the world",
        "Margalla Hills National Park",
        "Modern architecture and planning",
        "Diplomatic enclave",
      ],
      image: "/islamabad.jpg",
    },
    {
      name: "Peshawar",
      description:
        "One of the oldest cities in Asia and the capital of Khyber Pakhtunkhwa province. A historic frontier city with a rich cultural heritage influenced by its proximity to Afghanistan and Central Asia.",
      highlights: [
        "Historic Qissa Khwani Bazaar (Storytellers Market)",
        "Peshawar Museum",
        "Bala Hisar Fort",
        "Gateway to the Khyber Pass",
      ],
      image: "/Peshawar.jpg",
    },
    {
      name: "Quetta",
      description:
        "The capital of Balochistan province, situated in a river valley at an elevation of 1,680 meters. Known for its fruit orchards, distinctive culture, and as a gateway to Afghanistan and Iran.",
      highlights: [
        "Hanna Lake",
        "Hazarganji Chiltan National Park",
        "Quetta Geological Museum",
        "Unique Balochi culture and crafts",
      ],
      image: "/Quetta.jpeg",
    },
  ];

  // Practical information for travelers
  const practicalInfo = [
    {
      title: "Currency & Money",
      icon: <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />,
      content: `
        <p>The Pakistani Rupee (PKR) is the official currency. Notes come in denominations of 10, 20, 50, 100, 500, 1000, and 5000 rupees.</p>
        <p class="mt-2">ATMs are widely available in cities and accept major international cards. Credit cards are accepted at upscale establishments, but cash is preferred for most transactions.</p>
        <p class="mt-2">Currency exchange services are available at airports, banks, and authorized money changers. It's advisable to keep small denominations handy for local markets and transportation.</p>
      `,
      image: "naltar_valley_3.jpg",
    },
    {
      title: "Language & Communication",
      icon: <LanguageIcon className="h-6 w-6 text-primary-600" />,
      content: `
        <p>Urdu is the national language, while English is widely used in government, education, and business. Each province has its own regional language, with Punjabi being the most widely spoken.</p>
        <p class="mt-2">English is understood in tourist areas, hotels, and by educated Pakistanis, making communication relatively easy for English-speaking travelers.</p>
        <p class="mt-2">Learning a few basic Urdu phrases can enhance your experience and is appreciated by locals:</p>
        <ul class="list-disc list-inside mt-2 ml-4">
          <li>Hello/Peace be upon you: Assalam-o-Alaikum</li>
          <li>Thank you: Shukriya</li>
          <li>Yes: Haan / Ji</li>
          <li>No: Nahi</li>
          <li>Please: Meherbani</li>
        </ul>
      `,
      image: "pakistan_landscape_2.jpg",
    },
    {
      title: "Time Zone & Business Hours",
      icon: <ClockIcon className="h-6 w-6 text-primary-600" />,
      content: `
        <p>Pakistan follows Pakistan Standard Time (PST), which is UTC+5. There is no daylight saving time.</p>
        <p class="mt-2">Typical business hours:</p>
        <ul class="list-disc list-inside mt-2 ml-4">
          <li>Government offices: Monday to Friday, 9:00 AM to 5:00 PM</li>
          <li>Banks: Monday to Friday, 9:00 AM to 5:00 PM (some branches open Saturday morning)</li>
          <li>Shopping malls: Daily, 10:00 AM to 10:00 PM</li>
          <li>Local markets: Generally open from morning until evening, with a possible afternoon break</li>
        </ul>
        <p class="mt-2">Business hours may be reduced during the month of Ramadan, and many establishments close for prayers on Friday afternoon.</p>
      `,
      image: "naltar_valley_1.jpg",
    },
    {
      title: "Electricity & Plugs",
      icon: <InformationCircleIcon className="h-6 w-6 text-primary-600" />,
      content: `
        <p>Pakistan uses 220-240 volts, 50Hz electricity. The most common plug types are:</p>
        <ul class="list-disc list-inside mt-2 ml-4">
          <li>Type C: European-style plugs with two round pins</li>
          <li>Type D: Three round pins in a triangular pattern (most common)</li>
          <li>Type G: British-style plugs with three rectangular pins</li>
        </ul>
        <p class="mt-2">Travelers from countries using 110-120V systems (like the US and Canada) will need a voltage converter as well as a plug adapter.</p>
      `,
      image: "naltar_valley_2.jpg",
    },
    {
      title: "Internet & Connectivity",
      icon: <PhoneIcon className="h-6 w-6 text-primary-600" />,
      content: `
        <p>Mobile coverage is extensive throughout Pakistan, with 4G available in most urban areas. Major mobile operators include Jazz, Telenor, Zong, and Ufone.</p>
        <p class="mt-2">Visitors can purchase a local SIM card with a passport and visa documentation. This is recommended for affordable data and local calls.</p>
        <p class="mt-2">Wi-Fi is available in most hotels, cafes, and restaurants in urban areas, though speed and reliability can vary.</p>
      `,
      image: "pakistan_mountain_5.jpg",
    },
  ];

  // Cultural etiquette tips
  const etiquetteTips = [
    'Greet people with "Assalam-o-Alaikum" (Peace be upon you). The response is "Walaikum Assalam".',
    "Dress modestly, especially in rural areas. Women should cover shoulders and knees, and men should avoid shorts in public places.",
    "Remove shoes before entering homes, mosques, and some traditional establishments.",
    "Use your right hand for eating, giving, and receiving items, as the left hand is considered unclean.",
    "Ask permission before photographing people, especially women.",
    "Public displays of affection between couples are frowned upon.",
    "During Ramadan, avoid eating, drinking, or smoking in public during daylight hours.",
    "When invited to a home, bringing a small gift like sweets or fruit is appreciated.",
  ];

  return (
    <AboutPakistanLayout
      title="General Information"
      subtitle="Essential facts and practical information about Pakistan"
      heroImage="https://images.unsplash.com/photo-1567606940710-fa95fe99a584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About Pakistan
        </h2>
        <p className="text-gray-600 mb-6">
          Pakistan, officially the Islamic Republic of Pakistan, is a diverse
          country located at the crossroads of South Asia, Central Asia, and the
          Middle East. With a rich history dating back to ancient civilizations
          and a vibrant cultural heritage, Pakistan offers travelers a unique
          blend of natural beauty, historical sites, and warm hospitality.
        </p>
      </div>

      {/* Basic Facts */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <InformationCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
          Basic Facts
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {basicFacts.map((fact, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                      {fact.label}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                      {fact.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Major Cities */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Major Cities</h3>
        <div className="space-y-6">
          {majorCities.map((city, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="h-60 rounded-lg overflow-hidden">
                    <ImageFallback
                      src={city.image}
                      alt={`${city.name} city view`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {city.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{city.description}</p>
                  <h5 className="text-base font-medium text-gray-800 mb-2">
                    Highlights:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    {city.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Information */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Practical Information for Travelers
        </h3>
        <div className="space-y-6">
          {practicalInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="h-48 rounded-lg overflow-hidden">
                    <ImageFallback
                      src={getImageUrl(info.image)}
                      alt={info.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">{info.icon}</div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {info.title}
                      </h4>
                      <div
                        className="text-gray-600"
                        dangerouslySetInnerHTML={{ __html: info.content }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Etiquette */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Cultural Etiquette Tips
        </h3>
        <p className="text-gray-600 mb-6">
          Understanding and respecting local customs will enhance your
          experience in Pakistan:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {etiquetteTips.map((tip, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* National Symbols */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          National Symbols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                National Flag
              </h4>
              <div className="h-48 rounded-lg overflow-hidden">
                <ImageFallback
                  src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg"
                  alt="Flag of Pakistan"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-gray-600">
                The Pakistani flag consists of a dark green field with a white
                vertical stripe at the hoist side. A white crescent moon and
                five-pointed star are centered on the green field. The green
                represents the Muslim majority, while the white stripe
                represents religious minorities. The crescent and star are
                symbols of progress and light.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                National Emblem
              </h4>
              <div className="h-48 rounded-lg overflow-hidden">
                <ImageFallback
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ef/State_emblem_of_Pakistan.svg"
                  alt="National Emblem of Pakistan"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-gray-600">
                The national emblem features a shield with four quarters, each
                representing a major agricultural product: cotton, jute, tea,
                and wheat. The shield is surrounded by a wreath, with a scroll
                below bearing the national motto in Urdu: "Faith, Unity,
                Discipline."
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                National Animal
              </h4>
              <div className="h-48 rounded-lg overflow-hidden">
                <ImageFallback
                  src="/National Animal.jpg"
                  alt="Markhor - National Animal of Pakistan"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600">
                The Markhor, a large wild goat species found in the mountainous
                regions of Pakistan, is the national animal. Known for its
                impressive spiral horns, the Markhor is an endangered species
                protected by conservation efforts.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                National Bird
              </h4>
              <div className="h-48 rounded-lg overflow-hidden">
                <ImageFallback
                  src="/National Bird.jpeg"
                  alt="Chukar Partridge - National Bird of Pakistan"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600">
                The Chukar partridge, a game bird in the pheasant family, is
                Pakistan's national bird. It is found in the mountainous regions
                and is known for its distinctive call and beautiful plumage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AboutPakistanLayout>
  );
};

export default GeneralInfo;
