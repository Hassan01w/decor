import React, { useState } from 'react';
import { 
  Bookmark, 
  Copy, 
  Check, 
  Send,
  MessageCircle
} from 'lucide-react';
import { 
  getPinterestShareUrl, 
  getTwitterShareUrl, 
  getFacebookShareUrl, 
  getWhatsAppShareUrl 
} from '../../utils/seo';

interface SocialShareBarProps {
  url: string;
  title: string;
  media: string;
  excerpt: string;
  savesCount: number;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  url,
  title,
  media,
  excerpt,
  savesCount,
  isSaved,
  onToggleSave,
}) => {
  const [copied, setCopied] = useState(false);

  const pinUrl = getPinterestShareUrl(url, media, `${title} — ${excerpt}`);
  const twitterUrl = getTwitterShareUrl(url, `${title} via @TheDecorDiary`);
  const fbUrl = getFacebookShareUrl(url);
  const waUrl = getWhatsAppShareUrl(url, `${title}:`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 py-4">
      {/* Pinterest Share Button (Primary Focus) */}
      <a
        href={pinUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#E60023] hover:bg-[#C9001D] text-white rounded-full text-xs font-bold transition-all shadow-sm hover:scale-105"
        title="Pin to Pinterest"
      >
        <span className="text-sm font-black">P</span>
        <span>Pin Article</span>
      </a>

      {/* Save to Moodboard */}
      <button
        onClick={onToggleSave}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
          isSaved
            ? 'bg-[#8C6D53] text-white border-[#8C6D53]'
            : 'bg-white text-[#2D2A26] border-[#D9CFC4] hover:bg-[#EFE9E1]'
        }`}
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span>{isSaved ? 'Saved' : 'Save'}</span>
        <span className="text-[10px] opacity-80">({savesCount})</span>
      </button>

      {/* Facebook */}
      <a
        href={fbUrl}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-full bg-white border border-[#D9CFC4] text-[#3b5998] hover:bg-[#EFE9E1] transition-colors"
        title="Share on Facebook"
      >
        <span className="text-xs font-bold block w-4 h-4 text-center">f</span>
      </a>

      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-full bg-white border border-[#D9CFC4] text-[#1DA1F2] hover:bg-[#EFE9E1] transition-colors"
        title="Share on X (Twitter)"
      >
        <span className="text-xs font-bold block w-4 h-4 text-center">𝕏</span>
      </a>

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-full bg-white border border-[#D9CFC4] text-[#25D366] hover:bg-[#EFE9E1] transition-colors"
        title="Share via WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Copy URL */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full bg-white border border-[#D9CFC4] text-[#6B635B] hover:bg-[#EFE9E1] transition-colors"
        title="Copy article link"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};
