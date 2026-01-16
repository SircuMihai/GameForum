package com.forum.service;

import com.forum.model.AchievementsUsers;
import com.forum.repository.AchievementsUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AchievementsUsersService {
    @Autowired
    private AchievementsUsersRepository achievementsUsersRepository;

    public List<AchievementsUsers> findAll() {
        return achievementsUsersRepository.findAll();
    }

    public Optional<AchievementsUsers> findById(Integer id) {
        return achievementsUsersRepository.findById(id);
    }

    public AchievementsUsers create(AchievementsUsers au) {
        return achievementsUsersRepository.save(au);
    }

    public AchievementsUsers update(Integer id, AchievementsUsers au) {
        au.setMessageId(id);
        return achievementsUsersRepository.save(au);
    }

    public void delete(Integer id) {
        achievementsUsersRepository.deleteById(id);
    }
}
