import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  className?: string;
}

export function StarRating({ rating, maxRating = 5, onRatingChange, readonly = false, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={cn("flex space-x-1", className)}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverRating || rating);
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={cn(
              "focus:outline-none transition-colors",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            onClick={() => !readonly && onRatingChange?.(starValue)}
          >
            <Star
              className={cn(
                "h-5 w-5",
                isFilled ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
