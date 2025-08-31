package com.projectrux.repository;

import com.projectrux.entity.Otp;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OtpRepository extends MongoRepository<Otp, String> {

    Otp findByUserId(String otp);

    Long deleteByExpiryTimeBefore(LocalDateTime now);

}
