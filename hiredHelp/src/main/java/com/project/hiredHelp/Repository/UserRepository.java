package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findById(Long id);

    boolean existsByPhoneAndUserIdNot(String phone, Long userId);
}
