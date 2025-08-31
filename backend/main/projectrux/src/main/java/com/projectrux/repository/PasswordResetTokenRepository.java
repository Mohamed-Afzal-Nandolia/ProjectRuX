package com.projectrux.repository;

import com.projectrux.entity.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {

    PasswordResetToken findByResetToken(String token);

    Long deleteByExpiryTimeBefore(LocalDateTime now);
}
