package com.forum.service;

import com.forum.repository.AchievementsRepository;
import com.forum.model.Achievements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AchievementService {

    @Autowired
    private AchievementsRepository achievementsRepository;

    public List<Achievements> findAll() {
        return achievementsRepository.findAll();
    }

    public Optional<Achievements> findById(Integer id) {
        return achievementsRepository.findById(id);
    }

    public Achievements create(Achievements achievement) {
        return achievementsRepository.save(achievement);
    }

    public Achievements update(Integer id, Achievements achievement) {
        achievement.setAchievementId(id);
        return achievementsRepository.save(achievement);
    }

    public void delete(Integer id) {
        achievementsRepository.deleteById(id);
    }
}
