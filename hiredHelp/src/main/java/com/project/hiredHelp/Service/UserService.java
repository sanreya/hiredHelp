package com.project.hiredHelp.Service;

import com.project.hiredHelp.Entity.User;
import com.project.hiredHelp.GlobalExceptionHandler.ErrorType;
import com.project.hiredHelp.GlobalExceptionHandler.HiredHelpException;
import com.project.hiredHelp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findById(long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUserInfo(Long userId, User updatedUser) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        if (updatedUser.getPhone() != null
                && userRepository.existsByPhoneAndUserIdNot(
                updatedUser.getPhone(),
                userId)) {

            throw new HiredHelpException(
                    ErrorType.PHONE_ALREADY_EXISTS
            );
        }

        user.setFirstName(
                updatedUser.getFirstName() != null
                        ? updatedUser.getFirstName()
                        : user.getFirstName()
        );

        user.setLastName(
                updatedUser.getLastName() != null
                        ? updatedUser.getLastName()
                        : user.getLastName()
        );

        user.setAddress(
                updatedUser.getAddress() != null
                        ? updatedUser.getAddress()
                        : user.getAddress()
        );

        user.setLatitude(
                updatedUser.getLatitude() != null
                        ? updatedUser.getLatitude()
                        : user.getLatitude()
        );

        user.setLongitude(
                updatedUser.getLongitude() != null
                        ? updatedUser.getLongitude()
                        : user.getLongitude()
        );

        user.setPhone(
                updatedUser.getPhone() != null
                        ? updatedUser.getPhone()
                        : user.getPhone()
        );

        return userRepository.save(user);
    }
}
