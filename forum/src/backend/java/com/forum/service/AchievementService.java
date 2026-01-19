package com.forum.service;

import com.forum.repository.AchievementsRepository;
import com.forum.dto.mapper.AchievementMapper;
import com.forum.dto.request.AchievementRequest;
import com.forum.dto.response.AchievementResponse;
import com.forum.model.Achievements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    @Autowired
    private AchievementsRepository achievementsRepository;

    @Autowired
    private AchievementMapper achievementMapper;

    public List<AchievementResponse> findAll() {
        return achievementsRepository.findAll().stream()
                .map(achievementMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<AchievementResponse> findById(Integer id) {
        return achievementsRepository.findById(id).map(achievementMapper::toResponse);
    }

    public AchievementResponse create(AchievementRequest request) {
        Achievements entity = achievementMapper.toEntity(request);
        Achievements saved = achievementsRepository.save(entity);
        return achievementMapper.toResponse(saved);
    }

    public Optional<AchievementResponse> update(Integer id, AchievementRequest request) {
        return achievementsRepository.findById(id).map(existing -> {
            Achievements toUpdate = achievementMapper.toEntity(request);
            toUpdate.setAchievementId(id);
            Achievements saved = achievementsRepository.save(toUpdate);
            return achievementMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        achievementsRepository.deleteById(id);
    }
}
