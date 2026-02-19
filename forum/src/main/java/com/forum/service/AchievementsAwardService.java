package com.forum.service;

import com.forum.model.Achievements;
import com.forum.model.AchievementsUsers;
import com.forum.model.Subjects;
import com.forum.model.Users;
import com.forum.repository.AchievementsRepository;
import com.forum.repository.AchievementsUsersRepository;
import com.forum.repository.CategoryRepository;
import com.forum.repository.MessageRepository;
import com.forum.repository.SubjectRepository;
import com.forum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.Duration;
import java.util.List;

@Service
public class AchievementsAwardService {

    // Achievement IDs based on your seed
    private static final int ACH_TOWN_FOUNDER_FIRST_TOPIC = 1;
    private static final int ACH_FIRST_BATTLE_FIRST_POST = 2;
    private static final int ACH_VETERAN_COMMANDER_250_MESSAGES = 3;
    private static final int ACH_MASTER_STRATEGIST_TOPIC_50_REPLIES = 4;
    private static final int ACH_IMPERIAL_ADVISOR_ADMIN = 5;
    private static final int ACH_EXPLORER_ALL_CATEGORIES = 6;
    private static final int ACH_SKIRMISHER_10_MESSAGES = 7;
    private static final int ACH_LINE_INFANTRY_50_MESSAGES = 8;
    private static final int ACH_WARLORD_1000_MESSAGES = 10;
    private static final int ACH_MASTER_OF_BATTLEFIELD_5000_MESSAGES = 11;
    private static final int ACH_UNBREAKABLE_100_DAYS_FROM_CREATION = 12;
    private static final int ACH_IRON_WILL_1_YEAR_FROM_CREATION = 13;
    private static final int ACH_VILLAGE_BUILDER_10_TOPICS = 14;
    private static final int ACH_CITY_ARCHITECT_50_TOPICS = 15;
    private static final int ACH_CAPITAL_ESTABLISHED_200_TOPICS = 16;

    @Autowired
    private AchievementsUsersRepository achievementsUsersRepository;

    @Autowired
    private AchievementsRepository achievementsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageRepository messageRepository;

    public void onSubjectCreated(Integer userId) {
        if (userId == null) return;

        long topicCount = subjectRepository.countByUser_UserId(userId);

        if (topicCount == 1) award(userId, ACH_TOWN_FOUNDER_FIRST_TOPIC);
        if (topicCount == 10) award(userId, ACH_VILLAGE_BUILDER_10_TOPICS);
        if (topicCount == 50) award(userId, ACH_CITY_ARCHITECT_50_TOPICS);
        if (topicCount == 200) award(userId, ACH_CAPITAL_ESTABLISHED_200_TOPICS);

        // Admin achievement (in case role already admin)
        awardIfAdmin(userId);
        awardIfAccountOldEnough(userId);
        awardIfExplorer(userId);
    }

    public void onMessageCreated(Integer userId, Integer subjectId) {
        if (userId == null) return;

        long msgCount = messageRepository.countByUser_UserId(userId);

        if (msgCount == 1) award(userId, ACH_FIRST_BATTLE_FIRST_POST);
        if (msgCount == 10) award(userId, ACH_SKIRMISHER_10_MESSAGES);
        if (msgCount == 50) award(userId, ACH_LINE_INFANTRY_50_MESSAGES);
        if (msgCount == 250) award(userId, ACH_VETERAN_COMMANDER_250_MESSAGES);
        if (msgCount == 1000) award(userId, ACH_WARLORD_1000_MESSAGES);
        if (msgCount == 5000) award(userId, ACH_MASTER_OF_BATTLEFIELD_5000_MESSAGES);

        if (subjectId != null) {
            long replies = messageRepository.countBySubject_SubjectId(subjectId);
            if (replies == 50) {
                Subjects subject = subjectRepository.findById(subjectId).orElse(null);
                Integer ownerId = subject != null && subject.getUser() != null ? subject.getUser().getUserId() : null;
                if (ownerId != null) award(ownerId, ACH_MASTER_STRATEGIST_TOPIC_50_REPLIES);
            }
        }

        awardIfAdmin(userId);
        awardIfExplorer(userId);
    }

    public void recalculateForUser(Integer userId) {
        if (userId == null) return;

        long topicCount = subjectRepository.countByUser_UserId(userId);
        long msgCount = messageRepository.countByUser_UserId(userId);

        if (topicCount >= 1) award(userId, ACH_TOWN_FOUNDER_FIRST_TOPIC);
        if (topicCount >= 10) award(userId, ACH_VILLAGE_BUILDER_10_TOPICS);
        if (topicCount >= 50) award(userId, ACH_CITY_ARCHITECT_50_TOPICS);
        if (topicCount >= 200) award(userId, ACH_CAPITAL_ESTABLISHED_200_TOPICS);

        if (msgCount >= 1) award(userId, ACH_FIRST_BATTLE_FIRST_POST);
        if (msgCount >= 10) award(userId, ACH_SKIRMISHER_10_MESSAGES);
        if (msgCount >= 50) award(userId, ACH_LINE_INFANTRY_50_MESSAGES);
        if (msgCount >= 250) award(userId, ACH_VETERAN_COMMANDER_250_MESSAGES);
        if (msgCount >= 1000) award(userId, ACH_WARLORD_1000_MESSAGES);
        if (msgCount >= 5000) award(userId, ACH_MASTER_OF_BATTLEFIELD_5000_MESSAGES);

        // topic reaches 50 replies
        List<Subjects> subjects = subjectRepository.findByUser_UserId(userId);
        for (Subjects s : subjects) {
            long replies = messageRepository.countBySubject_SubjectId(s.getSubjectId());
            if (replies >= 50) {
                award(userId, ACH_MASTER_STRATEGIST_TOPIC_50_REPLIES);
                break;
            }
        }

        awardIfAdmin(userId);
    }

    public void recalculateAll() {
        List<Users> users = userRepository.findAll();
        for (Users u : users) {
            recalculateForUser(u.getUserId());
        }
    }

    public void onUserLogin(Integer userId) {
        if (userId == null) return;
        awardIfAccountOldEnough(userId);
    }

    public void onRoleChanged(Integer userId) {
        if (userId == null) return;
        awardIfAdmin(userId);
    }

    private void awardIfAdmin(Integer userId) {
        Users u = userRepository.findById(userId).orElse(null);
        if (u != null
                && u.getRole() != null
                && (u.getRole().equalsIgnoreCase("ADMIN") || u.getRole().equalsIgnoreCase("MODERATOR"))) {
            award(userId, ACH_IMPERIAL_ADVISOR_ADMIN);
        }
    }

    private void awardIfAccountOldEnough(Integer userId) {
        Users u = userRepository.findById(userId).orElse(null);
        if (u == null || u.getCreatedAt() == null) return;

        OffsetDateTime created;
        try {
            created = OffsetDateTime.parse(u.getCreatedAt());
        } catch (Exception ex) {
            return;
        }

        OffsetDateTime now = OffsetDateTime.now();
        long days = Duration.between(created, now).toDays();

        if (days >= 100) {
            award(userId, ACH_UNBREAKABLE_100_DAYS_FROM_CREATION);
        }
        if (days >= 365) {
            award(userId, ACH_IRON_WILL_1_YEAR_FROM_CREATION);
        }
    }

    private void awardIfExplorer(Integer userId) {
        long totalCategories = categoryRepository.count();
        if (totalCategories <= 0) return;

        long userCategories = subjectRepository.countDistinctCategoriesByUserId(userId);
        if (userCategories >= totalCategories) {
            award(userId, ACH_EXPLORER_ALL_CATEGORIES);
        }
    }

    private void award(Integer userId, int achievementId) {
        if (achievementsUsersRepository.existsByUsers_UserIdAndAchievements_AchievementId(userId, achievementId)) {
            return;
        }

        Achievements achievement = achievementsRepository.findById(achievementId).orElse(null);
        Users user = userRepository.findById(userId).orElse(null);
        if (achievement == null || user == null) return;

        AchievementsUsers au = new AchievementsUsers();
        au.setAchievements(achievement);
        au.setUsers(user);
        au.setObtainAt(OffsetDateTime.now().toString());
        achievementsUsersRepository.save(au);
    }
}
