package com.projectrux.repository;


import com.projectrux.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

//    String findByEmail(String email);

    Optional<User> findByUsername(String username);

}
