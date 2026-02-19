package com.forum.repository;

import com.forum.model.Achievements;
import com.forum.model.AchievementsUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementsUsersRepository extends JpaRepository<AchievementsUsers, Integer> {

    @Query("select au.achievements from AchievementsUsers au where au.users.userId = :userId")
    List<Achievements> findUnlockedAchievementsByUserId(@Param("userId") Integer userId);

    boolean existsByUsers_UserIdAndAchievements_AchievementId(Integer userId, Integer achievementId);

    void deleteByUsers_UserId(Integer userId);
}
