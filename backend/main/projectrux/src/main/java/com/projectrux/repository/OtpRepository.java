package com.projectrux.repository;

import com.projectrux.entity.Otp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OtpRepository extends MongoRepository<Otp, String> {

    Otp findByUserId(String otp);
}
