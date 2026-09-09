import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings } = useBlog();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F7F4EE] text-[#242522] min-h-screen pt-12 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DED2] shadow-xs">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center text-[#2D2A26]">Contact Us</h1>
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#8C6D53] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#2D2A26]">Message Received</h3>
              <p className="text-[#6B635B] max-w-md mx-auto">
                Thank you for reaching out to The Decor Diary team. We will get back to you within 24–48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <p className="text-sm text-[#6B635B] text-center mb-4">
                Have a question about an order, product inquiry, or styling question? Drop us a line below or reach out to us directly:
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-[#2D2A26] mb-8 font-medium bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DFD5]">
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase tracking-widest text-[#8C6D53] mb-1">Email</span>
                  <span>{siteSettings.contactEmail}</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[#E8DFD5]"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase tracking-widest text-[#8C6D53] mb-1">Phone</span>
                  <span>{siteSettings.contactPhone || '03364585863'}</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[#E8DFD5]"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase tracking-widest text-[#8C6D53] mb-1">Address</span>
                  <span>{siteSettings.contactAddress || 'Sargodha'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D2A26] mb-2">
                  Message / Inquiry
                </label>
                <textarea
                  required
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl text-sm focus:outline-none focus:border-[#8C6D53] transition-colors resize-y"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
