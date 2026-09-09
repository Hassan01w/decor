import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F7F4EE] text-[#242522] min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#2F3A32] text-xs font-bold uppercase tracking-widest border border-[#E5DED2]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
            <span>Our Story</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#242522]">
            About The Decor Diary
          </h1>
          <p className="text-base sm:text-lg text-[#5A534B] leading-relaxed max-w-2xl mx-auto">
            Discover the passion for interior design that drives us to help you transform your house into a beautiful, personalized home.
          </p>
        </div>

        {/* Image */}
        <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-[#E5DED2]">
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80" 
            alt="The Decor Diary Interior Inspiration" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* E-A-T Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E5DED2] shadow-xs">
          <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#242522] prose-p:text-[#5A534B]">
            <p>
              Welcome to <strong>The Decor Diary</strong>, where our lifelong passion for interior design meets your desire for a beautifully curated living space. Our journey began with a simple belief: a home should be more than just a physical structure; it should be a sanctuary that reflects your unique personality, comforts your soul, and inspires your daily life.
            </p>
            <p>
              For years, we've dedicated ourselves to studying the subtle nuances of design—from the warmth of minimalist furniture to the expressive power of trending wall art. We realized that many people struggle to find cohesive, high-quality pieces that truly speak to them. That’s why we created The Decor Diary. We aren't just an online home decor store; we are your partners in design.
            </p>
            <p>
              Our commitment to quality is unwavering. We meticulously source every item in our collection, prioritizing sustainable materials, expert craftsmanship, and unique designs that you won't find on every corner. Whether it's an aesthetic room accessory that adds the perfect finishing touch or a statement piece that defines a room, we ensure that everything we offer meets our rigorous standards for durability and style.
            </p>
            <p>
              Beyond our curated collections, we pride ourselves on delivering excellent customer service. We understand that shopping for your home is a deeply personal experience, and our dedicated team of design experts is always here to offer tailored advice, answer your styling questions, and ensure your journey from browsing to unboxing is seamless.
            </p>
            <p>
              Thank you for trusting The Decor Diary with your home. Let us help you turn your interior design dreams into a beautiful reality.
            </p>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DED2] shadow-xs text-center space-y-4">
            <div className="w-12 h-12 bg-[#F7F4EE] rounded-full flex items-center justify-center mx-auto text-[#C8A97E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold">Uncompromising Quality</h3>
            <p className="text-sm text-[#5A534B]">Expertly sourced materials and lasting craftsmanship.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E5DED2] shadow-xs text-center space-y-4">
            <div className="w-12 h-12 bg-[#F7F4EE] rounded-full flex items-center justify-center mx-auto text-[#C8A97E]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold">Unique Designs</h3>
            <p className="text-sm text-[#5A534B]">Curated aesthetics to make your space truly yours.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E5DED2] shadow-xs text-center space-y-4">
            <div className="w-12 h-12 bg-[#F7F4EE] rounded-full flex items-center justify-center mx-auto text-[#C8A97E]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold">Dedicated Service</h3>
            <p className="text-sm text-[#5A534B]">Expert guidance and support every step of the way.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
