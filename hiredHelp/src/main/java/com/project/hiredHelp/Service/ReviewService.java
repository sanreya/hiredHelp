package com.project.hiredHelp.Service;

import com.project.hiredHelp.DTO.CreateReviewRequest;
import com.project.hiredHelp.Entity.*;
import com.project.hiredHelp.Enum.AssignmentStatus;
import com.project.hiredHelp.Enum.ServiceRequestStatus;
import com.project.hiredHelp.GlobalExceptionHandler.ErrorType;
import com.project.hiredHelp.GlobalExceptionHandler.HiredHelpException;
import com.project.hiredHelp.Repository.ReviewRepository;
import com.project.hiredHelp.Repository.ServiceRequestAssignmentRepository;
import com.project.hiredHelp.Repository.ServiceRequestRepository;
import com.project.hiredHelp.Repository.TechnicianRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private ServiceRequestAssignmentRepository serviceRequestAssignmentRepository;

    @Transactional
    public Review createReview(
            Long requestId,
            CreateReviewRequest createReviewRequest
    ) {

        // 1. Find service request
        ServiceRequest serviceRequest =
                serviceRequestRepository.findById(requestId)
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.SERVICE_REQUEST_NOT_FOUND
                        ));

        // 2. Request must be completed before reviewing
        if (serviceRequest.getStatus() != ServiceRequestStatus.COMPLETED) {
            throw new HiredHelpException(ErrorType.INVALID_STATUS);
        }

        // 3. Only one review per service request
        if (reviewRepository.existsByRequest_RequestId(requestId)) {
            throw new HiredHelpException(ErrorType.REVIEW_ALREADY_EXISTS);
        }

        // 4. Validate rating
        if (createReviewRequest.getRating() == null || createReviewRequest.getRating() < 1 || createReviewRequest.getRating() > 5) {
            throw new HiredHelpException(ErrorType.INVALID_RATING);
        }

        // 5. Find accepted technician
        ServiceRequestAssignment assignment =
                serviceRequestAssignmentRepository
                        .findByRequest_RequestIdAndStatus(
                                requestId,
                                AssignmentStatus.ACCEPTED
                        )
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.ASSIGNMENT_NOT_FOUND
                        ));

        Technician technician = assignment.getTechnician();

        // 6. Get customer from service request
        User customer = serviceRequest.getCustomer();

        // 7. Create review
        Review newReview = new Review();

        newReview.setRequest(serviceRequest);
        newReview.setCustomer(customer);
        newReview.setTechnician(technician);
        newReview.setRating(createReviewRequest.getRating());
        newReview.setReview(createReviewRequest.getReview());

        Review savedReview = reviewRepository.save(newReview);

        // 8. Update technician rating statistics
        int oldTotalRatings = technician.getTotalRatings();
        double oldAverageRating = technician.getAverageRating();

        double newAverageRating =
                ((oldAverageRating * oldTotalRatings) + createReviewRequest.getRating())
                        / (oldTotalRatings + 1);

        technician.setAverageRating(newAverageRating);
        technician.setTotalRatings(oldTotalRatings + 1);

        technicianRepository.save(technician);

        return savedReview;
    }

    public Review updateReview(Long requestId, CreateReviewRequest request) {

        Review review = reviewRepository
                .findByRequest_RequestId(requestId)
                .orElseThrow(() -> new HiredHelpException(ErrorType.SERVICE_REQUEST_NOT_FOUND));

        review.setRating(request.getRating());
        review.setReview(request.getReview());

        return reviewRepository.save(review);
    }

    public List<Review> getTechnicianReviews(Long userId) {
        return reviewRepository.findByTechnician_User_UserId(userId);
    }
}
