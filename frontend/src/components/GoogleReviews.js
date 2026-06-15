import React, { useEffect, useState, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const STATIC_REVIEWS = [
  {
    author: "Sarah M.",
    rating: 5,
    text: "Absolutely brilliant service! My clothes came back perfectly clean and beautifully folded. The collection and delivery was right on time. Will definitely use again.",
    relative_time: "2 weeks ago",
    author_photo: "",
  },
  {
    author: "James T.",
    rating: 5,
    text: "Used Laundry Express for my dry cleaning and I'm so impressed. Super easy to book online, driver was friendly, and everything was returned spotless. Highly recommend!",
    relative_time: "1 month ago",
    author_photo: "",
  },
  {
    author: "Priya K.",
    rating: 5,
    text: "Fantastic service from start to finish. The app is easy to use, collection was prompt, and my laundry was returned in perfect condition. Best laundry service in Colchester!",
    relative_time: "3 weeks ago",
    author_photo: "",
  },
  {
    author: "David R.",
    rating: 5,
    text: "Really pleased with this service. Great value for money and my shirts have never looked so good. The free collection and delivery makes it so convenient.",
    relative_time: "1 month ago",
    author_photo: "",
  },
  {
    author: "Emma L.",
    rating: 5,
    text: "I've tried a few laundry services but Laundry Express is by far the best. Quick, reliable and my clothes always come back smelling fresh and neatly pressed.",
    relative_time: "2 months ago",
    author_photo: "",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ))}
  </div>
);

const Avatar = ({ name, photo }) => {
  if (photo) {
    return <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover" />;
  }
  return (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export const GoogleReviews = () => {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [overallRating, setOverallRating] = useState(5.0);
  const [totalRatings, setTotalRatings] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    api.get('/reviews')
      .then(res => {
        if (res.data.reviews && res.data.reviews.length > 0) {
          setReviews(res.data.reviews);
        }
        if (res.data.rating) setOverallRating(res.data.rating);
        if (res.data.total_ratings) setTotalRatings(res.data.total_ratings);
      })
      .catch(() => {});
  }, []);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      goTo('next');
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [reviews.length]);

  const goTo = (direction) => {
    if (isAnimating) return;
    clearInterval(intervalRef.current);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(prev =>
        direction === 'next'
          ? (prev + 1) % reviews.length
          : (prev - 1 + reviews.length) % reviews.length
      );
      setIsAnimating(false);
      startInterval();
    }, 200);
  };

  const review = reviews[current];

  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 mb-5">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            <span className="text-stone-500 font-medium text-sm">Google Reviews</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl font-bold text-stone-900">{Number(overallRating).toFixed(1)}</span>
            <div className="text-left">
              <StarRating rating={Math.round(overallRating)} />
              {totalRatings
                ? <p className="text-sm text-stone-400 mt-1">{totalRatings.toLocaleString()} reviews</p>
                : <p className="text-sm text-stone-400 mt-1">Verified reviews</p>
              }
            </div>
          </div>
        </div>

        {/* Review card */}
        <div className="relative px-6">
          <div
            className={`bg-white border border-stone-100 rounded-2xl p-8 shadow-sm transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          >
            <StarRating rating={review.rating} />
            <p className="mt-5 text-stone-700 text-base leading-relaxed min-h-[80px] italic">
              "{review.text}"
            </p>
            <div className="flex items-center gap-3 mt-7 pt-6 border-t border-stone-100">
              <Avatar name={review.author} photo={review.author_photo} />
              <div>
                <p className="font-semibold text-stone-900 text-sm">{review.author}</p>
                {review.relative_time && (
                  <p className="text-xs text-stone-400 mt-0.5">{review.relative_time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => goTo('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-stone-200 rounded-full p-2.5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-4 w-4 text-stone-500" />
          </button>
          <button
            onClick={() => goTo('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-stone-200 rounded-full p-2.5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight className="h-4 w-4 text-stone-500" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-7">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { clearInterval(intervalRef.current); setCurrent(i); startInterval(); }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${i === current ? 'bg-sky-500 w-6' : 'bg-slate-300 w-1.5'}`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>

        {/* Link to Google */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/place/LAUNDRY+EXPRESS+COLCHESTER/@51.8815884,0.7757225,12z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 font-medium text-sm transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
};
