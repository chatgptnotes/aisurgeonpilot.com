import React from 'react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
}

const LandingPage = ({ onGetStarted, onLoginClick }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="absolute top-0 w-full z-10 p-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-900">AI Surgeon Pilot</div>
          <Button
            onClick={() => window.location.href = '/login'}
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white border-blue-200"
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-image.png" 
            alt="Healthcare Technology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/20"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI Surgeon Pilot
            </h1>
            <p className="text-2xl md:text-3xl text-blue-100 mb-8 font-light">
              Your Digital Office – Convert Consultations into Commitments
            </p>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl leading-relaxed">
              Transform second opinion patients into surgical commitments with AI-powered voice agents,
              WhatsApp automation, and intelligent follow-ups. Stay connected with prospective patients
              who need more information, guidance, and confidence to choose you as their surgeon.
            </p>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Surgeons Who Value Patient Relationships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nurture prospective surgical patients with intelligent automation and personalized engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Voice Agents</h3>
              <p className="text-gray-600 leading-relaxed">
                Natural conversations with patients exploring surgical options. Answer questions, explain procedures, and guide decision-making 24/7
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">WhatsApp Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay connected where patients are most comfortable. Send procedure information, answer queries, and schedule consultations via WhatsApp
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Automations</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent follow-ups, appointment reminders, and personalized content delivery. Keep prospective patients engaged without manual effort
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Testimonial Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Doctor Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="/doctor-image.jpg" 
                  alt="Healthcare Professional" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">40%</div>
                    <div className="text-sm">Booking Increase</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Trusted by Leading Surgeons
                </h2>
                <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                  "AI Surgeon Pilot transformed my practice. Second opinion patients used to slip away,
                  but now the voice agent answers their questions anytime, and WhatsApp automation keeps
                  them engaged. My surgical bookings increased by 40% in just 3 months."
                </blockquote>
                <div className="border-l-4 border-blue-600 pl-6">
                  <div className="font-semibold text-gray-900 text-lg">Dr. Rajesh Sharma</div>
                  <div className="text-blue-600 font-medium">Senior Consultant Surgeon</div>
                  <div className="text-gray-600">Hope Multi-Specialty Hospital</div>
                </div>

                {/* Key Benefits */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">40% increase in surgical bookings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">24/7 patient engagement</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Automated follow-ups</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Higher patient confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;