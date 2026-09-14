import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  Send,
  Pin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, categories, navigate, addSubscriber } = useBlog();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const res = addSubscriber(email, 'Footer');
    if (res.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('idle');
    }
  };

  return (
    <footer className="bg-[#202722] text-[#E5DFD5] pt-16 pb-12 border-t border-[#2F3A32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#2F3A32]">
          {/* Brand & Editorial Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#F7F4EE] uppercase hover:text-[#C8A97E] transition-colors">
                {siteSettings.logoText && !siteSettings.logoText.toUpperCase().includes('HAVEN')
                  ? siteSettings.logoText
                  : 'THE DECOR DIARY'}
              </span>
              <p className="text-[11px] tracking-[0.28em] text-[#C8A97E] uppercase font-bold mt-1">
                {siteSettings.logoSubtext && !siteSettings.logoSubtext.toUpperCase().includes('HAVEN') && !siteSettings.logoSubtext.toUpperCase().includes('LIFESTYLE JOURNAL')
                  ? siteSettings.logoSubtext
                  : 'ONLINE HOME DECOR STORE'}
              </p>
            </div>
            
            <p className="text-sm text-[#B8B1A5] leading-relaxed max-w-sm">
              {siteSettings.footerAbout}
            </p>

            {/* Social Icons with Pinterest prominence */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={siteSettings.socialLinks.pinterest || 'https://pinterest.com'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#E60023] hover:bg-[#C9001D] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                title="Follow on Pinterest"
              >
                <Pin className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#242522] hover:bg-[#3E4D42] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm border border-[#3E4D42]"
                title="Follow on Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#1877F2] hover:bg-[#1465C0] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                title="Follow on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#FF0000] hover:bg-[#D40000] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                title="YouTube Home Tours"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings.contactEmail || 'thedecordiarystore@gmail.com'}`}
                className="w-10 h-10 rounded-xl bg-[#8C6D53] hover:bg-[#735742] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                title="Contact Editorial Team"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C8A97E] font-bold">
              Curated Topics
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B8B1A5]">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="hover:text-white hover:translate-x-1 transition-all cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="text-[#C8A97E] hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>All Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial & Information */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C8A97E] font-bold">
              Editorial & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B8B1A5]">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact The Editors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Affiliate & Ad Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C8A97E] font-bold">
              The Sunday Dispatch
            </h4>
            <p className="text-xs text-[#B8B1A5] leading-relaxed">
              Weekly mindful interior essays, printable cleaning checklists, and exclusive room styling guides delivered every Sunday morning.
            </p>
            {status === 'success' ? (
              <div className="p-3 bg-[#2A342D] border border-[#A68B6A] rounded-xl text-xs text-[#F7F4EE] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A97E]" />
                <span>You're on the list! Welcome home.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full px-3.5 py-2.5 bg-[#2A342D] border border-[#3E4D42] rounded-xl text-xs text-[#F7F4EE] placeholder-[#8C8578] focus:outline-none focus:border-[#C8A97E] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#A68B6A] hover:bg-[#8C7355] text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#8C8578]">
                  No spam ever. Unsubscribe anytime with 1 click.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8578]">
          <p>{siteSettings.copyrightNotice}</p>
          <div className="flex items-center gap-6">
            <span>🌿 Natural + Luxury + Minimal + Warm</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#C8A97E] hover:underline cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
