package com.projectrux.repository;


import com.projectrux.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findByCreatedBy(String id);

    @Query("{ 'applicants.userId': ?0 }")
    List<Post> findAllByApplicantUserId(String userId);

}
