'use client';

import React, { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { ChevronDown, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// FAQ data
const faqData = [
  {
    id: 'faq1',
    question: 'What is the National Immunization Schedule?',
    answer: 'The National Immunization Schedule (NIS) is a vaccination schedule recommended by the government that outlines the vaccines to be administered to children at specific ages. It is designed to protect children from serious vaccine-preventable diseases.'
  },
  {
    id: 'faq2',
    question: 'Why is it important to follow the vaccination schedule?',
    answer: 'Following the recommended vaccination schedule ensures that children receive vaccines at the optimal time for protection against diseases. Delaying or missing vaccinations may leave your child vulnerable to preventable diseases. The schedule is carefully designed to provide immunity when children are most at risk for diseases.'
  },
  {
    id: 'faq3',
    question: 'Are there side effects from vaccines?',
    answer: 'Most vaccines may cause mild side effects such as soreness at the injection site, low-grade fever, or mild irritability. These side effects typically resolve within a few days. Serious side effects are extremely rare. The benefits of vaccination in preventing serious diseases greatly outweigh the risk of side effects.'
  },
  {
    id: 'faq4',
    question: 'What if my child misses a scheduled vaccine?',
    answer: 'If your child misses a vaccine, talk to your healthcare provider about a catch-up vaccination schedule. Most vaccines can still be given later, though some may require a modified schedule. It\'s important to get back on track with vaccinations as soon as possible to ensure protection against diseases.'
  },
  {
    id: 'faq5',
    question: 'How does this app help track vaccinations?',
    answer: 'This app helps you track your child\'s vaccinations based on the National Immunization Schedule. You can add your children\'s information, view their vaccination status, receive reminders for upcoming vaccines, and mark vaccines as completed. The app provides a convenient way to ensure your child stays up-to-date with their recommended vaccinations.'
  },
  {
    id: 'faq6',
    question: 'Is my data safe in this app?',
    answer: 'Yes, data security is a priority. All personal information is securely stored on your device and, if enabled, backed up with encryption. The app does not share your personal data with third parties. You can delete your data from the app at any time through the profile settings.'
  },
  {
    id: 'faq7',
    question: 'Can I use this app for multiple children?',
    answer: 'Yes, you can add multiple children to the app and track their vaccination schedules separately. Each child will have their own profile and personalized vaccination tracking based on their date of birth and the recommended schedule.'
  },
  {
    id: 'faq8',
    question: 'What should I do if I have questions about a specific vaccine?',
    answer: 'For specific questions about vaccines, you should consult with your child\'s healthcare provider. They can provide personalized advice based on your child\'s medical history and needs. The information in this app is for general guidance and is not a substitute for professional medical advice.'
  },
  {
    id: 'faq9',
    question: 'How accurate is the vaccination schedule in the app?',
    answer: 'The vaccination schedule in the app is based on the current National Immunization Schedule. However, vaccine recommendations may change over time, and individual needs may vary. The app is updated regularly to reflect the latest guidelines, but always confirm with your healthcare provider for the most up-to-date recommendations for your child.'
  },
  {
    id: 'faq10',
    question: 'Can I export my child\'s vaccination records?',
    answer: 'Currently, the app does not support exporting vaccination records. This feature may be added in future updates. For official vaccination records, please consult with your healthcare provider who maintains your child\'s medical records.'
  }
];

export default function FAQPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const toggleFaq = (faqId: string) => {
    if (expandedFaq === faqId) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(faqId);
    }
  };
  
  return (
    <main className="bg-gray-950 min-h-screen text-white">
      <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">
        <header className="mb-8">
          <Link href="/profile" className="flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Profile
          </Link>
          
          <h1 className="text-2xl font-bold flex items-center">
            <HelpCircle className="h-6 w-6 mr-2 text-blue-500" />
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 mt-1">
            Find answers to common questions about vaccinations and the app
          </p>
        </header>
        
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center"
                onClick={() => toggleFaq(faq.id)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedFaq === faq.id ? 'rotate-180' : ''
                }`} />
              </button>
              
              {expandedFaq === faq.id && (
                <div className="p-4 pt-0 border-t border-gray-800">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 