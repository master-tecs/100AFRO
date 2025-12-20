import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, Briefcase } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-afro-primary font-bold uppercase tracking-widest text-sm mb-4 block">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Contact 100AFRO</h1>
          <p className="text-xl text-gray-400">
            Whether you have a breaking story, want to advertise with us, or just want to say hello, we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Info */}
          <div>
             <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Department Contacts</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-900/30 p-3 rounded-lg text-blue-400 mr-4">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Editorial Team</h4>
                      <p className="text-gray-400 text-sm mb-1">For press releases, news tips, and corrections.</p>
                      <a href="mailto:editor@100afro.com" className="text-afro-primary hover:underline">editor@100afro.com</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-900/30 p-3 rounded-lg text-green-400 mr-4">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Advertising & Sales</h4>
                      <p className="text-gray-400 text-sm mb-1">For campaigns, sponsorships, and partnerships.</p>
                      <a href="mailto:ads@100afro.com" className="text-afro-primary hover:underline">ads@100afro.com</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-900/30 p-3 rounded-lg text-purple-400 mr-4">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">General Inquiries</h4>
                      <p className="text-gray-400 text-sm mb-1">For all other questions.</p>
                      <a href="mailto:info@100afro.com" className="text-afro-primary hover:underline">info@100afro.com</a>
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Global Headquarters</h3>
                <div className="space-y-4 text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="mr-3 text-afro-primary" size={20} />
                    <span>123 Oxford Street, London, W1D 1LP, UK</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-3 text-afro-primary" size={20} />
                    <span>+44 20 7123 4567</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-white font-bold mb-2">Regional Offices</h4>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      <li>• Lagos, Nigeria</li>
                      <li>• Accra, Ghana</li>
                      <li>• Johannesburg, SA</li>
                      <li>• New York, USA</li>
                    </ul>
                  </div>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-950 p-8 rounded-3xl border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => {e.preventDefault(); alert('Message sent!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input type="text" id="firstName" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary transition-colors" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input type="text" id="lastName" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary transition-colors" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input type="email" id="email" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary transition-colors" placeholder="john@example.com" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <select id="subject" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-afro-primary transition-colors">
                  <option>General Inquiry</option>
                  <option>Editorial Correction</option>
                  <option>Advertising Opportunity</option>
                  <option>Job Application</option>
                  <option>Report Technical Issue</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea id="message" rows={6} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary transition-colors" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" className="w-full bg-afro-primary hover:bg-white text-black font-bold py-4 rounded-lg transition-colors text-lg uppercase tracking-wide">
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;