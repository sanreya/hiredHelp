package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

        Optional<Review> findByRequest_RequestId(Long requestId);

        boolean existsByRequest_RequestId(Long requestId);

        List<Review> findByTechnician_User_UserId(Long userId);
}
