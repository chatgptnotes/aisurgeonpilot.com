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
              Your AI-Powered Digital Office – Empowering Surgeons with Intelligent Automation
            </p>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl leading-relaxed">
              Transform your surgical practice with AI agents that handle patient communication,
              create educational content, automate WhatsApp messaging, and manage appointments –
              so you can focus on what matters most: your patients' care.
            </p>
            
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI Agents Working for Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI automation tools designed specifically for surgeons to streamline practice management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Voice Agents</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent voice assistants that handle patient calls, answer questions, and provide pre/post-op instructions 24/7
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">WhatsApp Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated WhatsApp messaging for appointment reminders, follow-ups, and personalized patient communication
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Education Videos</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-generated personalized educational videos for patients about procedures, recovery, and post-operative care
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered appointment scheduling that optimizes your calendar and reduces no-shows automatically
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
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm">Surgeons Empowered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Built by Surgeons, for Surgeons
                </h2>
                <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                  "AI Surgeon Pilot has transformed my practice. The AI voice agents handle routine
                  patient queries while I focus on surgeries. WhatsApp automation keeps patients
                  informed, and the educational videos have significantly improved patient compliance
                  and satisfaction."
                </blockquote>
                <div className="border-l-4 border-blue-600 pl-6">
                  <div className="font-semibold text-gray-900 text-lg">Dr. Rajesh Kumar</div>
                  <div className="text-blue-600 font-medium">General & Laparoscopic Surgeon</div>
                  <div className="text-gray-600">Multi-Specialty Surgical Practice</div>
                </div>
                
                {/* Key Benefits */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Save 10+ hours per week</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">24/7 patient support</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Reduced no-shows by 60%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Better patient education</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Version Info */}
      <footer className="py-4 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-gray-400">
            Version 1.0 | Last Updated: 2025-10-26
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;