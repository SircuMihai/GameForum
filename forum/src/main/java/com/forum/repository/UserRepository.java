package com.forum.repository;

import com.forum.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    boolean existsByUserEmail(String userEmail);
    boolean existsByNickname(String nickname);
}
