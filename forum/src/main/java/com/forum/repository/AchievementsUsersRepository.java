package com.forum.repository;

import com.forum.model.AchievementsUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementsUsersRepository extends JpaRepository<AchievementsUsers, Integer> {
}
