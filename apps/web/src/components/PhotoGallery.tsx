import React, { useState } from 'react';
import { CafePhoto } from '@cafefinder/shared';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  photos: CafePhoto[];
  cafeName: string;
  className?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos = [],
  cafeName,
  className = '',
}) => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const displayPhotos = photos.length > 0 ? photos : [
    {
      photoReference: 'default',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80',
    },
    {
      photoReference: 'default_2',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    },
    {
      photoReference: 'default_3',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalIndex !== null) {
      setModalIndex((modalIndex + 1) % displayPhotos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalIndex !== null) {
      setModalIndex((modalIndex - 1 + displayPhotos.length) % displayPhotos.length);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[360px] md:h-[440px] rounded-3xl overflow-hidden">
        {/* Large Hero Photo (Left 2/4 or 3/4) */}
        <div
          onClick={() => setModalIndex(0)}
          className="relative md:col-span-2 lg:col-span-2 h-full overflow-hidden cursor-pointer group bg-stone-100 dark:bg-stone-800"
        >
          <img
            src={displayPhotos[0].url}
            alt={`${cafeName} main`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 2 Smaller Side Photos (Right 2/4) */}
        <div className="hidden md:grid grid-rows-2 col-span-2 gap-3 h-full">
          {displayPhotos.slice(1, 3).map((photo, idx) => (
            <div
              key={photo.photoReference || idx}
              onClick={() => setModalIndex(idx + 1)}
              className="relative h-full overflow-hidden cursor-pointer group bg-stone-100 dark:bg-stone-800"
            >
              <img
                src={photo.url}
                alt={`${cafeName} preview ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {idx === 1 && displayPhotos.length > 3 && (
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Images className="w-3.5 h-3.5" />
                  <span>+{displayPhotos.length - 3} more photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {modalIndex !== null && (
        <div
          onClick={() => setModalIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setModalIndex(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            aria-label="Close fullscreen gallery"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
          >
            <img
              src={displayPhotos[modalIndex].url}
              alt={`${cafeName} photo ${modalIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            {displayPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
              {modalIndex + 1} of {displayPhotos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
