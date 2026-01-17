package com.forum.service;

import com.forum.dto.mapper.AchievementsUsersMapper;
import com.forum.dto.request.AchievementsUsersRequest;
import com.forum.dto.response.AchievementsUsersResponse;
import com.forum.model.Achievements;
import com.forum.model.AchievementsUsers;
import com.forum.model.Users;
import com.forum.repository.AchievementsRepository;
import com.forum.repository.AchievementsUsersRepository;
import com.forum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementsUsersService {
    @Autowired
    private AchievementsUsersRepository achievementsUsersRepository;

    @Autowired
    private AchievementsRepository achievementsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementsUsersMapper achievementsUsersMapper;

    public List<AchievementsUsersResponse> findAll() {
        return achievementsUsersRepository.findAll().stream()
                .map(achievementsUsersMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<AchievementsUsersResponse> findById(Integer id) {
        return achievementsUsersRepository.findById(id).map(achievementsUsersMapper::toResponse);
    }

    public AchievementsUsersResponse create(AchievementsUsersRequest request) {
        AchievementsUsers entity = achievementsUsersMapper.toEntity(request);
        if (request.getAchievementId() != null) {
            Achievements ach = achievementsRepository.findById(request.getAchievementId()).orElseThrow();
            entity.setAchievements(ach);
        }
        if (request.getUserId() != null) {
            Users user = userRepository.findById(request.getUserId()).orElseThrow();
            entity.setUsers(user);
        }
        AchievementsUsers saved = achievementsUsersRepository.save(entity);
        return achievementsUsersMapper.toResponse(saved);
    }

    public Optional<AchievementsUsersResponse> update(Integer id, AchievementsUsersRequest request) {
        return achievementsUsersRepository.findById(id).map(existing -> {
            AchievementsUsers toUpdate = achievementsUsersMapper.toEntity(request);
            toUpdate.setMessageId(id);
            if (request.getAchievementId() != null) {
                Achievements ach = achievementsRepository.findById(request.getAchievementId()).orElseThrow();
                toUpdate.setAchievements(ach);
            }
            if (request.getUserId() != null) {
                Users user = userRepository.findById(request.getUserId()).orElseThrow();
                toUpdate.setUsers(user);
            }
            AchievementsUsers saved = achievementsUsersRepository.save(toUpdate);
            return achievementsUsersMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        achievementsUsersRepository.deleteById(id);
    }
}
