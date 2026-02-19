package com.forum.controller;

import com.forum.dto.mapper.UserMapper;
import com.forum.dto.mapper.AchievementMapper;
import com.forum.dto.request.SetQuotoRequest;
import com.forum.dto.request.SetAvatarRequest;
import com.forum.dto.request.SetTitleRequest;
import com.forum.dto.request.SetRoleRequest;
import com.forum.dto.request.ChangePasswordRequest;
import com.forum.service.UserService;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.AchievementResponse;
import com.forum.dto.response.TitleOptionResponse;
import com.forum.dto.response.UserResponse;
import com.forum.exception.BadRequestException;
import com.forum.exception.ErrorMessages;
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

    @Autowired
    private AchievementMapper achievementMapper;

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

    @GetMapping("/{id}/achievements")
    public List<AchievementResponse> getUnlockedAchievements(@PathVariable Integer id) {
        return achievementsUsersRepository.findUnlockedAchievementsByUserId(id).stream()
                .map(achievementMapper::toResponse)
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
                .orElseThrow(() -> new NotFoundException(
                        ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_EMAIL, authentication.getName())));

        if (!id.equals(authedUser.getUserId())) {
            throw new AccessDeniedException(ErrorMessages.ACCESS_DENIED_TITLE_CHANGE);
        }

        Integer achievementId = request != null ? request.getAchievementId() : null;

        if (achievementId == null) {
            authedUser.setSelectedTitleAchievement(null);
            Users saved = userRepository.save(authedUser);
            return ResponseEntity.ok(userMapper.toResponse(saved));
        }

        boolean unlocked = achievementsUsersRepository.existsByUsers_UserIdAndAchievements_AchievementId(id, achievementId);
        if (!unlocked) {
            throw new BadRequestException(ErrorMessages.ACHIEVEMENT_TITLE_NOT_UNLOCKED);
        }

        Achievements achievement = achievementsRepository.findById(achievementId)
                .orElseThrow(() -> new NotFoundException(
                        ErrorMessages.format(ErrorMessages.ACHIEVEMENT_NOT_FOUND_BY_ID, achievementId)));

        authedUser.setSelectedTitleAchievement(achievement);
        Users saved = userRepository.save(authedUser);
        return ResponseEntity.ok(userMapper.toResponse(saved));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> setRole(@PathVariable Integer id, @RequestBody SetRoleRequest request) {
        String role = request != null ? request.getRole() : null;
        return ResponseEntity.ok(userService.setRole(id, role));
    }

    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> ban(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.setBanned(id, true));
    }

    @PutMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> unban(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.setBanned(id, false));
    }

    @PutMapping("/{id}/avatar")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<UserResponse> setAvatar(
            @PathVariable Integer id,
            @RequestBody SetAvatarRequest request,
            Authentication authentication
    ) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        Users authedUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException(
                        ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_EMAIL, authentication.getName())));

        if (!id.equals(authedUser.getUserId())) {
            throw new AccessDeniedException(ErrorMessages.ACCESS_DENIED_AVATAR_CHANGE);
        }

        String avatar = request != null ? request.getAvatar() : null;
        authedUser.setAvatar(userMapper.base64ToBytes(avatar));
        Users saved = userRepository.save(authedUser);
        return ResponseEntity.ok(userMapper.toResponse(saved));
    }

    @PutMapping("/{id}/quoto")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<UserResponse> setQuoto(
            @PathVariable Integer id,
            @RequestBody SetQuotoRequest request,
            Authentication authentication
    ) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        Users authedUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException(
                        ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_EMAIL, authentication.getName())));

        if (!id.equals(authedUser.getUserId())) {
            throw new AccessDeniedException(ErrorMessages.ACCESS_DENIED_QUOTO_CHANGE);
        }

        String quoto = request != null ? request.getQuoto() : null;
        authedUser.setQuoto(quoto);
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

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePasswordMe(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        userService.changePasswordSelf(authentication.getName(), request != null ? request.getCurrentPassword() : null,
                request != null ? request.getNewPassword() : null);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        userService.deleteSelf(authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (userService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
