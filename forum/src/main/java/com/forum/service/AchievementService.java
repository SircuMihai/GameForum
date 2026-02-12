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
        entity.setAchievementPhoto(normalizeAchievementPhoto(entity.getAchievementPhoto()));
        Achievements saved = achievementsRepository.save(entity);
        return achievementMapper.toResponse(saved);
    }

    public Optional<AchievementResponse> update(Integer id, AchievementRequest request) {
        return achievementsRepository.findById(id).map(existing -> {
            Achievements toUpdate = achievementMapper.toEntity(request);
            toUpdate.setAchievementId(id);
            toUpdate.setAchievementPhoto(normalizeAchievementPhoto(toUpdate.getAchievementPhoto()));
            Achievements saved = achievementsRepository.save(toUpdate);
            return achievementMapper.toResponse(saved);
        });
    }

    private String normalizeAchievementPhoto(String value) {
        if (value == null) return null;

        String v = value.trim();
        if (v.isEmpty()) return null;

        v = v.replace('\\', '/');

        // If user provides an absolute URL, keep it as-is
        if (v.startsWith("http://") || v.startsWith("https://")) return v;

        // Allow both Achievments/... and /Achievments/...
        if (v.startsWith("Achievments/")) return "/" + v;
        if (v.startsWith("/Achievments/")) return v;

        // If only filename is provided
        if (!v.startsWith("/")) return "/Achievments/" + v;

        // Any other absolute path: keep it (caller responsibility)
        return v;
    }

    public void delete(Integer id) {
        achievementsRepository.deleteById(id);
    }
}
