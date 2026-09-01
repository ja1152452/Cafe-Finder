import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  Star,
  Clock,
  Heart,
  Share2,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { RatingBadge } from '../components/RatingBadge.js';
import { PriceIndicator } from '../components/PriceIndicator.js';
import { OpenStatusBadge } from '../components/OpenStatusBadge.js';
import { FavoriteButton } from '../components/FavoriteButton.js';
import { ShareButton } from '../components/ShareButton.js';
import { PhotoGallery } from '../components/PhotoGallery.js';
import { ReviewCard } from '../components/ReviewCard.js';
import { OpeningHoursTable } from '../components/OpeningHoursTable.js';
import { AmenitiesList } from '../components/AmenitiesList.js';
import { CafeCard } from '../components/CafeCard.js';
import { CafeMap } from '../components/CafeMap.js';
import { SkeletonDetails } from '../components/SkeletonDetails.js';
import { ErrorState } from '../components/ErrorState.js';
import { useCafeDetails } from '../hooks/useCafeDetails.js';
import { useCafeSearch } from '../hooks/useCafeSearch.js';
import { useMapStore } from '../stores/mapStore.js';
import { useAnalytics } from '../hooks/useAnalytics.js';

export const CafeDetailsPage: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const { userLocation } = useMapStore();
  const { trackEvent } = useAnalytics();

  const { data: cafe, isLoading, isError, refetch } = useCafeDetails(placeId, userLocation);

  // Fetch nearby similar cafes
  const { data: nearbyData } = useCafeSearch({
    lat: cafe?.location.lat,
    lng: cafe?.location.lng,
    radius: 10000,
    pageSize: 4,
  });

  useEffect(() => {
    if (cafe) {
      trackEvent('cafe_viewed', { placeId: cafe.placeId, name: cafe.name });
    }
  }, [cafe, trackEvent]);

  if (isLoading) return <SkeletonDetails />;

  if (isError || !cafe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Cafe details unavailable"
          message="We couldn't retrieve the details for this cafe. It may have moved or been updated."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cafe.location.lat},${cafe.location.lng}&destination_place_id=${cafe.placeId}`;
  const similarCafes = (nearbyData?.cafes || []).filter((c) => c.placeId !== cafe.placeId).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/search"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </Link>
        <ShareButton title={cafe.name} />
      </div>

      {/* Main Header Information */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {cafe.categories?.[0]?.replace('_', ' ') || 'Cafe'}
              </span>
              <OpenStatusBadge openingHours={cafe.openingHours} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              {cafe.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
              <RatingBadge rating={cafe.rating} reviewCount={cafe.userRatingsTotal} size="md" />
              <PriceIndicator level={cafe.priceLevel} />
              {cafe.formattedDistance && (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{cafe.formattedDistance} away</span>
                </span>
              )}
            </div>

            <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>{cafe.address}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            <FavoriteButton cafe={cafe} size="lg" showText className="shadow-sm" />
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid & Lightbox */}
      <PhotoGallery photos={cafe.photos} cafeName={cafe.name} />

      {/* Two Column Layout: Left Details + Right Info Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Editorial / About summary */}
          {cafe.editorialSummary && (
            <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>About this cafe</span>
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {cafe.editorialSummary}
              </p>
            </div>
          )}

          {/* Amenities & Features */}
          <AmenitiesList amenities={cafe.amenities} />

          {/* Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                <h3 className="font-extrabold text-xl text-stone-900 dark:text-stone-100">
                  Google Community Reviews
                </h3>
              </div>
              <span className="text-xs text-stone-400">
                {cafe.reviews?.length || 0} reviews shown
              </span>
            </div>

            {cafe.reviews && cafe.reviews.length > 0 ? (
              <div className="space-y-4">
                {cafe.reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 text-sm">
                No recent written reviews available from Google for this location.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Contact, Opening Hours & Location Map */}
        <div className="space-y-6">
          {/* Contact & Links Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3.5">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Contact & Links
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {cafe.phoneNumber && (
                <a
                  href={`tel:${cafe.phoneNumber}`}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{cafe.phoneNumber}</span>
                </a>
              )}

              {cafe.website && (
                <a
                  href={cafe.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-amber-600 dark:text-amber-400 font-medium transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Visit Official Website</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              )}

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Open in Google Maps</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Opening Hours Table */}
          <OpeningHoursTable openingHours={cafe.openingHours} />

          {/* Embedded Mini Location Map */}
          <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-800">
            <CafeMap cafes={[cafe]} />
          </div>
        </div>
      </div>

      {/* Similar Cafes Carousel */}
      {similarCafes.length > 0 && (
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-2xl text-stone-900 dark:text-white tracking-tight">
              Other Cafes You Might Like
            </h3>
            <Link
              to="/search"
              className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarCafes.map((item) => (
              <CafeCard key={item.placeId} cafe={item} variant="vertical" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
