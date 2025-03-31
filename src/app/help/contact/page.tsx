'use client';

import React, { useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { MessageCircle, ArrowLeft, Send, Phone, Mail, Check } from 'lucide-react';
import Link from 'next/link';

export default function ContactSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to a backend service
    console.log('Support message submitted:', { name, email, subject, message });
    setSubmitted(true);
    
    // Reset form after submission
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    
    // Reset submitted state after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
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
            <MessageCircle className="h-6 w-6 mr-2 text-blue-500" />
            Contact Support
          </h1>
          <p className="text-gray-400 mt-1">
            Have questions or need help? We're here for you.
          </p>
        </header>
        
        <div className="space-y-6">
          <section className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            
            {submitted ? (
              <div className="bg-green-900/30 border border-green-900/40 rounded-lg p-4 flex items-center">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <h3 className="text-green-400 font-medium">Message Sent!</h3>
                  <p className="text-gray-300 text-sm">
                    Thank you for reaching out. We'll respond to your inquiry as soon as possible.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What can we help you with?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                    placeholder="Please describe your issue or question in detail"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </section>
          
          <section className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-300 text-sm">support@vaccinetracker.example.com</p>
                  <p className="text-gray-400 text-xs mt-1">We typically respond within 24-48 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-xs mt-1">Available Mon-Fri, 9 AM - 5 PM</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-blue-900/20 rounded-lg border border-blue-900/40 p-4">
            <p className="text-sm text-center text-gray-300">
              For urgent medical concerns related to vaccinations, please contact your healthcare provider directly.
            </p>
          </section>
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 