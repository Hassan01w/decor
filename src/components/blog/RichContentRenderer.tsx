import React from 'react';
import { ContentBlock } from '../../types';
import { Share2, Info, AlertTriangle, Lightbulb, Quote, ExternalLink } from 'lucide-react';
import { getPinterestShareUrl } from '../../utils/seo';

interface RichContentRendererProps {
  blocks: ContentBlock[];
  articleTitle: string;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({ blocks, articleTitle }) => {
  if (!blocks || (Array.isArray(blocks) && blocks.length === 0)) {
    return (
      <p className="text-base text-[#4A423B] leading-relaxed italic">
        No content has been published for this article yet.
      </p>
    );
  }

  if (typeof blocks === 'string') {
    return (
      <div className="article-content space-y-4 text-[#3B342F] text-base sm:text-lg leading-[1.8]">
        <p>{blocks}</p>
      </div>
    );
  }

  if (!Array.isArray(blocks)) {
    return null;
  }

  return (
    <div className="article-content space-y-7 text-[#3B342F] text-base sm:text-lg leading-[1.8] font-normal">
      {blocks.map((block, index) => {
        if (!block) return null;
        const { type, id } = block;
        const content = block.content || {};

        switch (type) {
          case 'paragraph': {
            // First paragraph dropcap styling for editorial charm
            const isFirst = index === 0;
            const text = content.text || '';
            if (!text) return null;
            return (
              <p 
                key={id || index} 
                className={`${isFirst ? 'editorial-dropcap text-lg sm:text-xl font-normal text-[#2D2A26]' : 'text-base sm:text-lg'} leading-relaxed text-[#3B342F]`}
              >
                {text}
              </p>
            );
          }

          case 'heading2':
            if (!content.text) return null;
            return (
              <h2 
                key={id || index} 
                className="font-serif text-2xl sm:text-3xl font-bold text-[#211E1B] pt-6 pb-1 tracking-tight border-b border-[#EFE9E1]"
              >
                {content.text}
              </h2>
            );

          case 'heading3':
            if (!content.text) return null;
            return (
              <h3 
                key={id || index} 
                className="font-serif text-xl sm:text-2xl font-bold text-[#2D2A26] pt-4 tracking-tight"
              >
                {content.text}
              </h3>
            );

          case 'image': {
            if (!content.url) return null;
            const pinUrl = getPinterestShareUrl(
              window.location.href,
              content.url || '',
              content.caption || articleTitle || 'The Decor Diary'
            );

            return (
              <figure key={id || index} className="my-8 space-y-3 group">
                <div className="relative overflow-hidden rounded-2xl bg-[#EFE9E1] border border-[#E8DFD5]">
                  <img
                    src={content.url}
                    alt={content.alt || content.caption || 'Article illustration'}
                    loading="lazy"
                    className="w-full h-auto max-h-[650px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Pinterest Pin Button */}
                  <a
                    href={pinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-4 left-4 bg-[#E60023] hover:bg-[#C9001D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg opacity-90 hover:opacity-100 transition-all"
                    title="Pin this image to Pinterest"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Save Pin</span>
                  </a>
                </div>
                {content.caption && (
                  <figcaption className="text-center text-xs sm:text-sm text-[#7D7368] italic">
                    {content.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case 'quote':
            if (!content.text) return null;
            return (
              <blockquote 
                key={id || index} 
                className="my-8 p-6 sm:p-8 bg-[#F4EFEA] border-l-4 border-[#8C6D53] rounded-r-2xl space-y-3 shadow-xs"
              >
                <div className="flex gap-3">
                  <Quote className="w-8 h-8 text-[#8C6D53] shrink-0 opacity-40 -mt-1" />
                  <p className="font-serif text-lg sm:text-xl italic font-medium text-[#211E1B] leading-relaxed">
                    "{content.text}"
                  </p>
                </div>
                {content.author && (
                  <cite className="block text-right text-xs uppercase font-bold tracking-widest text-[#8C6D53]">
                    — {content.author}
                  </cite>
                )}
              </blockquote>
            );

          case 'callout': {
            const calloutType = content.calloutType || 'tip';
            let bgClass = 'bg-[#F5F2EC] border-[#D8C7B5] text-[#2D2A26]';
            let Icon = Lightbulb;
            let iconColor = 'text-[#8C6D53]';

            if (calloutType === 'info') {
              bgClass = 'bg-[#EBF2F7] border-[#BCD2E8] text-[#1E3A5F]';
              Icon = Info;
              iconColor = 'text-[#2B6CB0]';
            } else if (calloutType === 'warning') {
              bgClass = 'bg-[#FEF5E7] border-[#FAD7A0] text-[#784212]';
              Icon = AlertTriangle;
              iconColor = 'text-[#D35400]';
            }

            return (
              <div 
                key={id || index} 
                className={`my-6 p-5 sm:p-6 rounded-2xl border ${bgClass} space-y-2`}
              >
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                  <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                  <span>{content.calloutTitle || 'Editorial Note'}</span>
                </div>
                {content.text && (
                  <p className="text-sm sm:text-base leading-relaxed pl-7">
                    {content.text}
                  </p>
                )}
              </div>
            );
          }

          case 'bullet_list': {
            const items = Array.isArray(content.items) ? content.items.filter(Boolean) : [];
            if (items.length === 0) return null;
            return (
              <ul key={id || index} className="my-4 space-y-2.5 list-none pl-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base sm:text-lg leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-[#8C6D53] shrink-0 mt-2.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }

          case 'number_list': {
            const items = Array.isArray(content.items) ? content.items.filter(Boolean) : [];
            if (items.length === 0) return null;
            return (
              <ol key={id || index} className="my-4 space-y-3 list-none counter-reset pl-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3.5 text-base sm:text-lg leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-[#EFE9E1] text-[#8C6D53] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ol>
            );
          }

          case 'shoppable_product':
            if (!content.productTitle) return null;
            return (
              <div key={id || index} className="my-8 flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-shadow">
                {content.productImage && (
                  <div className="w-full sm:w-1/3 aspect-square rounded-xl overflow-hidden bg-[#F4EFEA]">
                    <img src={content.productImage} alt={content.productTitle || 'Product'} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                  {content.productBrand && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D53]">{content.productBrand}</span>
                  )}
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#211E1B] leading-tight">
                    {content.productTitle}
                  </h4>
                  {content.productPrice && (
                    <p className="text-lg text-[#4A423B] font-medium">{content.productPrice}</p>
                  )}
                  <div className="pt-2">
                    <a
                      href={content.productLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D2A26] hover:bg-[#8C6D53] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );

          case 'button':
            if (!content.buttonText) return null;
            return (
              <div key={id || index} className="my-6 text-center sm:text-left">
                <a
                  href={content.buttonUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8C6D53] hover:bg-[#A07D62] text-white rounded-full text-sm font-semibold tracking-wide shadow-md transition-all hover:scale-105"
                >
                  <span>{content.buttonText || 'Learn More'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );

          case 'video':
            if (!content.embedUrl) return null;
            return (
              <div key={id || index} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#E8DFD5]">
                <iframe
                  src={content.embedUrl}
                  title="Article Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );

          case 'gallery': {
            const images = Array.isArray(content.images) ? content.images.filter(img => img && img.url) : [];
            if (images.length === 0) return null;
            const gridCols = images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : images.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            return (
              <div key={id || index} className={`my-8 grid gap-4 ${gridCols}`}>
                {images.map((img, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl bg-[#EFE9E1] border border-[#E8DFD5] group aspect-square">
                    <img
                      src={img.url}
                      alt={img.alt || img.caption || `Gallery image ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-xs sm:text-sm text-center">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          case 'divider':
            return (
              <div key={id || index} className="my-10 flex items-center justify-center gap-2">
                <span className="w-12 h-px bg-[#D9CFC4]" />
                <span className="w-2 h-2 rounded-full bg-[#8C6D53]" />
                <span className="w-12 h-px bg-[#D9CFC4]" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
