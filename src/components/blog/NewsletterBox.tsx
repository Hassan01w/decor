import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Mail, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface NewsletterBoxProps {
  variant?: 'card' | 'banner' | 'compact';
  title?: string;
  subtitle?: string;
  source?: string;
}

export const NewsletterBox: React.FC<NewsletterBoxProps> = ({
  variant = 'card',
  title = 'The Mindful Living Dispatch',
  subtitle = 'Join 65,000+ readers who receive our curated Sunday morning guide to warm interiors, weekend DIY projects, pantry organization rituals, and slow living.',
  source = 'Newsletter Component'
}) => {
  const { addSubscriber } = useBlog();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const res = addSubscriber(email, source);
    if (res.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('idle');
    }
  };

  if (variant === 'compact') {
    return (
      <div className="p-6 bg-white rounded-2xl border border-[#E5DED2] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-[#2F3A32]">
          <Sparkles className="w-4 h-4 text-[#C8A97E]" />
          <span className="text-xs uppercase tracking-widest font-bold text-[#A68B6A]">Free Weekly Issue</span>
        </div>
        <h4 className="font-serif text-lg font-bold text-[#242522]">{title}</h4>
        <p className="text-xs text-[#5A534B] leading-relaxed">{subtitle}</p>

        {status === 'success' ? (
          <div className="p-3 bg-[#F7F4EE] border border-[#2F3A32] rounded-xl text-xs text-[#242522] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F3A32] shrink-0" />
            <span>Welcome! Your welcome guide is on its way.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              className="w-full px-3.5 py-2.5 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#2F3A32]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2F3A32] hover:bg-[#A68B6A] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#202722] via-[#2F3A32] to-[#252E27] text-[#F7F4EE] p-8 sm:p-12 lg:p-16 border border-[#3E4D42] shadow-2xl">
      {/* Background Warm Decorative Accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#C8A97E]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-[#A68B6A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#202722]/80 text-[#C8A97E] text-xs font-bold uppercase tracking-widest border border-[#3E4D42]">
          <Mail className="w-3.5 h-3.5 text-[#C8A97E]" />
          <span>Curated Sunday Journal</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-[#DCD6CC] leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>

        {status === 'success' ? (
          <div className="p-4 bg-[#202722] border border-[#C8A97E] rounded-2xl text-sm text-[#F7F4EE] flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C8A97E]" />
            <span className="font-medium">You’re officially subscribed! Check your inbox this Sunday morning.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-5 py-3.5 bg-[#1B221D] border border-[#3E4D42] rounded-2xl text-sm text-[#F7F4EE] placeholder-[#8A857B] focus:outline-none focus:border-[#C8A97E] shadow-inner"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#A68B6A] hover:bg-[#8C7355] text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-102 shadow-lg cursor-pointer shrink-0"
            >
              <span>Join The List</span>
              <ArrowRight className="w-4 h-4 text-[#F7F4EE]" />
            </button>
          </form>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-[#B8B1A5] pt-2">
          <span>✓ Delivered every Sunday</span>
          <span>✓ Zero advertising spam</span>
          <span>✓ Instant PDF checklists included</span>
        </div>
      </div>
    </div>
  );
};
