package com.forum.controller;

import com.forum.dto.mapper.UserMapper;
import com.forum.dto.request.SetTitleRequest;
import com.forum.service.UserService;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.TitleOptionResponse;
import com.forum.dto.response.UserResponse;
import com.forum.exception.BadRequestException;
import com.forum.exception.NotFoundException;
import com.forum.model.Achievements;
import com.forum.model.Users;
import com.forum.repository.AchievementsRepository;
import com.forum.repository.AchievementsUsersRepository;
import com.forum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementsUsersRepository achievementsUsersRepository;

    @Autowired
    private AchievementsRepository achievementsRepository;

    @Autowired
    private UserMapper userMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Integer id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/titles")
    public List<TitleOptionResponse> getUnlockedTitles(@PathVariable Integer id) {
        return achievementsUsersRepository.findUnlockedAchievementsByUserId(id).stream()
                .map(a -> new TitleOptionResponse(a.getAchievementId(), a.getAchievementName()))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/title")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<UserResponse> setSelectedTitle(
            @PathVariable Integer id,
            @RequestBody SetTitleRequest request,
            Authentication authentication
    ) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        Users authedUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException("User not found: " + authentication.getName()));

        if (!id.equals(authedUser.getUserId())) {
            throw new AccessDeniedException("You can only change your own title");
        }

        Integer achievementId = request != null ? request.getAchievementId() : null;

        if (achievementId == null) {
            authedUser.setSelectedTitleAchievement(null);
            Users saved = userRepository.save(authedUser);
            return ResponseEntity.ok(userMapper.toResponse(saved));
        }

        boolean unlocked = achievementsUsersRepository.existsByUsers_UserIdAndAchievements_AchievementId(id, achievementId);
        if (!unlocked) {
            throw new BadRequestException("Title not unlocked");
        }

        Achievements achievement = achievementsRepository.findById(achievementId)
                .orElseThrow(() -> new NotFoundException("Achievement not found: " + achievementId));

        authedUser.setSelectedTitleAchievement(achievement);
        Users saved = userRepository.save(authedUser);
        return ResponseEntity.ok(userMapper.toResponse(saved));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> create(@RequestBody UserRequest request) {
        UserResponse created = userService.create(request);
        return ResponseEntity.created(URI.create("/api/user/" + created.getUserId())).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == @userRepository.findByUserEmail(authentication.name).orElse(null)?.userId")
    public ResponseEntity<UserResponse> update(@PathVariable Integer id, @RequestBody UserRequest request, Authentication authentication) {
        return userService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (userService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
