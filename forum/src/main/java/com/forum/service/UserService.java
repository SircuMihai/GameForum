package com.forum.service;

import com.forum.dto.mapper.UserMapper;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.UserResponse;
import com.forum.exception.BadRequestException;
import com.forum.repository.UserRepository;
import com.forum.model.Users;
import com.forum.exception.ConflictException;
import com.forum.exception.ErrorMessages;
import com.forum.exception.NotFoundException;
import com.forum.security.JwtTokenStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AchievementsAwardService achievementsAwardService;

    @Autowired
    private JwtTokenStore jwtTokenStore;

    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<UserResponse> findById(Integer id) {
        return userRepository.findById(id).map(userMapper::toResponse);
    }

    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUserEmail(request.getUserEmail())) {
            throw new ConflictException(ErrorMessages.USER_EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new ConflictException(ErrorMessages.USER_NICKNAME_ALREADY_EXISTS);
        }
        Users entity = userMapper.toEntity(request);
        entity.setRole("USER");
        String now = OffsetDateTime.now().toString();
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(now);
        }
        if (entity.getLastLogin() == null) {
            entity.setLastLogin(now);
        }
        if (request.getPassword() != null) {
            entity.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        Users saved = userRepository.save(entity);
        return userMapper.toResponse(saved);
    }

    public Optional<UserResponse> update(Integer id, UserRequest request) {
        return userRepository.findById(id).map(existing -> {
            if (request.getUserEmail() != null
                    && !request.getUserEmail().equals(existing.getUserEmail())
                    && userRepository.existsByUserEmail(request.getUserEmail())) {
                throw new ConflictException(ErrorMessages.USER_EMAIL_ALREADY_EXISTS);
            }
            if (request.getNickname() != null
                    && !request.getNickname().equals(existing.getNickname())
                    && userRepository.existsByNickname(request.getNickname())) {
                throw new ConflictException(ErrorMessages.USER_NICKNAME_ALREADY_EXISTS);
            }
            Users toUpdate = userMapper.toEntity(request);
            toUpdate.setUserId(id);
            toUpdate.setSelectedTitleAchievement(existing.getSelectedTitleAchievement());
            toUpdate.setSubjects(existing.getSubjects());
            toUpdate.setMessages(existing.getMessages());
            toUpdate.setAchievementsUsers(existing.getAchievementsUsers());
            toUpdate.setRole(existing.getRole());
            if (request.getPassword() != null) {
                toUpdate.setPassword(passwordEncoder.encode(request.getPassword()));
            } else {
                toUpdate.setPassword(existing.getPassword());
            }
            Users saved = userRepository.save(toUpdate);
            return userMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        userRepository.deleteById(id);
    }

    public boolean authenticate(String email, String rawPassword) {
        return userRepository.findByUserEmail(email)
                .map(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
                .orElse(false);
    }

    public UserResponse setRole(Integer id, String role) {
        if (role == null || role.isBlank()) {
            throw new BadRequestException(ErrorMessages.INVALID_REQUEST);
        }

        String normalized = role.trim().toUpperCase();
        Set<String> allowed = Set.of("USER", "MODERATOR", "ADMIN");
        if (!allowed.contains(normalized)) {
            throw new BadRequestException(ErrorMessages.INVALID_REQUEST);
        }

        Users user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_ID, id)));

        user.setRole(normalized);
        Users saved = userRepository.save(user);

        achievementsAwardService.onRoleChanged(saved.getUserId());
        return userMapper.toResponse(saved);
    }

    public UserResponse setBanned(Integer id, boolean banned) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_ID, id)));

        user.setBanned(banned);
        Users saved = userRepository.save(user);

        if (banned) {
            jwtTokenStore.revokeTokensByUsername(saved.getUserEmail());
        }
        return userMapper.toResponse(saved);
    }
}
