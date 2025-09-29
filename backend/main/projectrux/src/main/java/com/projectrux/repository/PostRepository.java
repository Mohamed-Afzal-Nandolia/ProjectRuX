package com.projectrux.repository;


import com.projectrux.entity.Post;
import com.projectrux.enums.Roles;
import com.projectrux.enums.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findByCreatedBy(String id);

    @Query("{ 'applicants.userId': ?0 }")
    List<Post> findAllByApplicantUserId(String userId);

    @Query("{ 'rolesRequired.role': ?0 }")
    List<Post> findByRole(Roles role);

    // Find posts by skill inside rolesRequired.requiredSkills
    @Query("{ 'rolesRequired.requiredSkills': ?0 }")
    List<Post> findBySkill(Skill skill);

    // Find posts by both role and skill
    @Query("{ 'rolesRequired.role': ?0, 'rolesRequired.requiredSkills': ?1 }")
    List<Post> findByRoleAndSkill(Roles role, Skill skill);

}
