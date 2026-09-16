import React, { useEffect, useState } from 'react';
import { technicianApi } from '../../api/technicianApi';
import { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Star, MessageSquare } from 'lucide-react';

export function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      technicianApi.getReviews(user.userId)
        .then(setReviews)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Customer Reviews</h1>
        <p className="text-slate-500 mt-1">See what people are saying about your service</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg">
        <div>
          <p className="text-slate-400 mb-1 font-medium">Overall Rating</p>
          <div className="flex items-center">
            <span className="text-4xl font-bold mr-3">{averageRating}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i <= parseFloat(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 mb-1 font-medium">Total Reviews</p>
          <p className="text-3xl font-bold">{reviews.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid gap-4">
          {reviews.map(review => (
            <Card key={review.reviewId} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {(review.customer.firstName + ' ' + review.customer.lastName || 'Anonymous').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{review.customer.firstName + ' ' + review.customer.lastName || 'Anonymous'}</h4>
                      <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">
                  "{review.review}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50 mt-8">
          <CardContent className="p-16 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No reviews yet</h3>
            <p className="text-slate-500">Complete jobs and provide great service to get your first review.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
