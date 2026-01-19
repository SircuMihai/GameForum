package com.forum.repository;

import com.forum.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    boolean existsByUserEmail(String userEmail);
    boolean existsByNickname(String nickname);
    Optional<Users> findByNickname(String nickname);
    Optional<Users> findByUserEmail(String userEmail);
}
