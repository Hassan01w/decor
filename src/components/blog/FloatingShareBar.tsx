import React, { useState } from 'react';
import { Pin, Twitter, Mail, MessageCircle, Copy, Check, Share2 } from 'lucide-react';
import { getPinterestShareUrl, getTwitterShareUrl, getWhatsAppShareUrl } from '../../utils/seo';

interface FloatingShareBarProps {
  url: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
}

export const FloatingShareBar: React.FC<FloatingShareBarProps> = ({
  url,
  title,
  excerpt = '',
  imageUrl = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pinterestUrl = getPinterestShareUrl(url, imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6', `${title} — ${excerpt}`);
  const twitterUrl = getTwitterShareUrl(url, `✨ Check out this inspiring article: "${title}" via @TheDecorDiary`);
  const whatsappUrl = getWhatsAppShareUrl(url, `✨ Read this beautiful home decor guide: *${title}*`);
  const emailSubject = encodeURIComponent(`Inspirational Decor Guide: ${title}`);
  const emailBody = encodeURIComponent(`Hi!\n\nI thought you would love this article on The Decor Diary:\n\n"${title}"\n${excerpt}\n\nRead more here: ${url}`);
  const mailtoUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  return (
    <>
      {/* Desktop Floating Left Sidebar */}
      <div className="hidden xl:flex flex-col items-center gap-3 fixed left-6 top-1/3 z-40 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-[#E5DED2]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D53] mb-1 [writing-mode:vertical-lr] rotate-180">
          Share
        </span>

        {/* Pinterest */}
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-xl bg-[#E60023] hover:bg-[#C9001D] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
          title="Pin to Pinterest"
        >
          <Pin className="w-4 h-4" />
        </a>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-xl bg-[#242522] hover:bg-[#3E4D42] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
          title="Share on Twitter / X"
        >
          <Twitter className="w-4 h-4" />
        </a>

        {/* Email */}
        <a
          href={mailtoUrl}
          className="w-10 h-10 rounded-xl bg-[#8C6D53] hover:bg-[#735742] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
          title="Share via Email"
        >
          <Mail className="w-4 h-4" />
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#1EBE57] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="w-10 h-10 rounded-xl bg-[#F7F4EE] hover:bg-[#EFE9E1] text-[#242522] border border-[#E5DED2] flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#7A7369]" />}
        </button>
      </div>

      {/* Mobile / Tablet Bottom Sticky Share Bar */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#242522]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#3E4D42] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#C8A97E]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">Share Article</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={pinterestUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#E60023] text-white hover:scale-105 transition-transform"
            title="Pinterest"
          >
            <Pin className="w-4 h-4" />
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-black text-white hover:scale-105 transition-transform border border-stone-700"
            title="Twitter / X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={mailtoUrl}
            className="p-2 rounded-xl bg-[#8C6D53] text-white hover:scale-105 transition-transform"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#25D366] text-white hover:scale-105 transition-transform"
            title="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-stone-700 text-white hover:scale-105 transition-transform"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
};
