import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewApi } from '../../api/reviewApi';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';

export function ReviewTechnicianPage() {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast('Please provide a rating', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      if (id) {
        await reviewApi.create(parseInt(id), { rating, review });
        toast('Review submitted successfully', 'success');
        navigate('/user/completed');
      }
    } catch (error) {
      toast('Failed to submit review', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Rate Your Experience</h1>
        <p className="text-slate-500 mt-2">Your feedback helps us improve our service and helps others find great technicians.</p>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle>Leave a Review</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">How would you rate the service?</label>
              <div className="flex items-center space-x-4">
                <StarRating rating={rating} onRatingChange={setRating} className="text-3xl" />
                <span className="text-slate-500 text-sm">
                  {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Tell us more about your experience</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you like or dislike? How was the technician's professionalism and skill?"
                rows={5}
                required
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="px-8 shadow-sm">
                Submit Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
