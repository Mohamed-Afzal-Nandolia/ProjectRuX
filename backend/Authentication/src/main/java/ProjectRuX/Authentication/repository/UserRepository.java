package ProjectRuX.Authentication.repository;

import ProjectRuX.Authentication.entity.AuthUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<AuthUser, String> {

    Optional<AuthUser> findByEmail(String email);

    Optional<AuthUser> findByUsername(String username);

}
