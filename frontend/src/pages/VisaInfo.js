import React from 'react';
import AboutPakistanLayout from '../components/layout/AboutPakistanLayout';
import { DocumentTextIcon, CheckCircleIcon, QuestionMarkCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const VisaInfo = () => {
  // Visa types information
  const visaTypes = [
    {
      type: 'Tourist Visa',
      description: 'For travelers visiting Pakistan for tourism purposes. Valid for up to 3 months with possible extensions.',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Recent passport-sized photographs',
        'Proof of accommodation in Pakistan',
        'Return/onward ticket',
        'Proof of sufficient funds'
      ]
    },
    {
      type: 'Business Visa',
      description: 'For business-related travel to Pakistan. Valid for up to 5 years with multiple entries allowed.',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Letter of invitation from a Pakistani company',
        'Letter from employer stating purpose of visit',
        'Business registration documents',
        'Recent passport-sized photographs'
      ]
    },
    {
      type: 'Visit Visa',
      description: 'For those visiting family or friends in Pakistan. Valid for up to 1 year.',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Invitation letter from host in Pakistan',
        'Copy of host\'s CNIC (Pakistani ID card)',
        'Proof of relationship with the host (if applicable)',
        'Recent passport-sized photographs'
      ]
    },
    {
      type: 'Work Visa',
      description: 'For those employed by a Pakistani company. Valid for the duration of the employment contract.',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Employment contract',
        'Letter from Pakistani employer',
        'Educational and professional certificates',
        'Recent passport-sized photographs'
      ]
    }
  ];

  // Countries eligible for e-Visa
  const eVisaCountries = [
    'United States', 'United Kingdom', 'Canada', 'China', 'Japan', 'Australia', 
    'Norway', 'New Zealand', 'Denmark', 'Sweden', 'Switzerland', 'Finland', 
    'Belgium', 'Spain', 'Italy', 'Singapore', 'Malaysia', 'South Korea', 
    'France', 'Germany', 'Portugal', 'Ireland', 'Brazil', 'Argentina', 
    'Austria', 'Netherlands', 'Luxembourg', 'Greece', 'Iceland'
  ];

  // Visa on arrival eligible countries
  const visaOnArrivalCountries = [
    'United Kingdom', 'United States', 'Canada', 'China', 'Japan', 'France', 
    'Germany', 'Italy', 'Netherlands', 'Spain', 'Sweden', 'Norway', 'Denmark', 
    'Finland', 'Belgium', 'Luxembourg', 'Austria', 'Portugal', 'Ireland', 
    'Greece', 'Switzerland'
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How long does it take to process a Pakistani visa?',
      answer: 'Processing times vary depending on the type of visa and your country of residence. E-visas are typically processed within 7-10 business days, while regular visa applications at embassies may take 10-15 business days.'
    },
    {
      question: 'Can I extend my visa while in Pakistan?',
      answer: 'Yes, visa extensions are possible. You need to apply at the Ministry of Interior in Islamabad or at the local passport office in major cities before your current visa expires.'
    },
    {
      question: 'Do I need a sponsor for a tourist visa to Pakistan?',
      answer: 'For most nationalities, a sponsor is not required for a tourist visa. However, having a letter of invitation from a hotel or tour operator in Pakistan can strengthen your application.'
    },
    {
      question: 'Is there a fee for Pakistani visas?',
      answer: 'Yes, visa fees vary depending on your nationality and the type of visa. E-visas typically cost between $35-100 USD. Check the official website for the most current fee structure.'
    },
    {
      question: 'Can I apply for a Pakistani visa online?',
      answer: 'Yes, Pakistan offers an e-Visa system for citizens of many countries. Visit the official Pakistan Online Visa System at visa.nadra.gov.pk to check eligibility and apply.'
    }
  ];

  return (
    <AboutPakistanLayout
      title="Visa Information"
      subtitle="Everything you need to know about obtaining a visa for Pakistan"
      heroImage="https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pakistan Visa Requirements</h2>
        <p className="text-gray-600 mb-6">
          Most foreign nationals require a visa to enter Pakistan. The country offers several types of visas depending on the purpose of your visit.
          In recent years, Pakistan has significantly improved its visa policy, introducing e-Visas and visa-on-arrival options for many nationalities.
        </p>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-8">
          <p className="text-primary-800 font-medium">
            <span className="font-bold">Important:</span> Visa requirements can change. Always check with the Pakistani embassy or consulate in your country for the most up-to-date information before planning your trip.
          </p>
        </div>
      </div>

      {/* E-Visa Information */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
          Pakistan E-Visa System
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 mb-4">
            Pakistan's e-Visa system allows eligible travelers to apply for a visa online without visiting an embassy or consulate.
            The system is available for tourist, business, and visit visa categories.
          </p>
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">How to Apply for an E-Visa:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
              <li>Visit the official Pakistan Online Visa System at <a href="https://visa.nadra.gov.pk" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">visa.nadra.gov.pk</a></li>
              <li>Create an account and complete the online application form</li>
              <li>Upload the required documents (passport copy, photo, etc.)</li>
              <li>Pay the visa fee online</li>
              <li>Track your application status through the portal</li>
              <li>Download and print your e-Visa once approved</li>
            </ol>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">E-Visa Eligible Countries (Partial List):</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {eVisaCountries.map((country, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">{country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visa on Arrival */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Visa on Arrival</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 mb-4">
            Pakistan offers visa on arrival for citizens of selected countries, primarily for tourism purposes. 
            This service is available at major international airports in Pakistan.
          </p>
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Requirements for Visa on Arrival:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Valid passport with at least 6 months validity</li>
              <li>Return/onward ticket</li>
              <li>Proof of accommodation in Pakistan</li>
              <li>Sufficient funds for the duration of stay</li>
              <li>Visa fee payment (in USD)</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Visa on Arrival Eligible Countries (Partial List):</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {visaOnArrivalCountries.map((country, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">{country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visa Types */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Types of Pakistani Visas</h3>
        <div className="space-y-6">
          {visaTypes.map((visa, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900">{visa.type}</h4>
              <p className="text-gray-600 mt-2 mb-4">{visa.description}</p>
              <h5 className="text-base font-medium text-gray-800 mb-2">Requirements:</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                {visa.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">{item.question}</h4>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Useful Links */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Useful Resources</h3>
        <ul className="space-y-3">
          <li>
            <a 
              href="https://visa.nadra.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-800"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              <span>Pakistan Online Visa System</span>
            </a>
          </li>
          <li>
            <a 
              href="https://mofa.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-800"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              <span>Ministry of Foreign Affairs, Pakistan</span>
            </a>
          </li>
          <li>
            <a 
              href="https://www.nadra.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-800"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              <span>National Database & Registration Authority (NADRA)</span>
            </a>
          </li>
        </ul>
      </div>
    </AboutPakistanLayout>
  );
};

export default VisaInfo;
