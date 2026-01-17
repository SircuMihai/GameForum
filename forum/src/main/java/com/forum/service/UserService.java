package com.forum.service;

import com.forum.dto.mapper.UserMapper;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.UserResponse;
import com.forum.repository.UserRepository;
import com.forum.model.Users;
import com.forum.exception.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

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
            throw new ConflictException("Email already in use: " + request.getUserEmail());
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new ConflictException("Nickname already in use: " + request.getNickname());
        }
        Users entity = userMapper.toEntity(request);
        Users saved = userRepository.save(entity);
        return userMapper.toResponse(saved);
    }

    public Optional<UserResponse> update(Integer id, UserRequest request) {
        return userRepository.findById(id).map(existing -> {
            if (request.getUserEmail() != null
                    && !request.getUserEmail().equals(existing.getUserEmail())
                    && userRepository.existsByUserEmail(request.getUserEmail())) {
                throw new ConflictException("Email already in use: " + request.getUserEmail());
            }
            if (request.getNickname() != null
                    && !request.getNickname().equals(existing.getNickname())
                    && userRepository.existsByNickname(request.getNickname())) {
                throw new ConflictException("Nickname already in use: " + request.getNickname());
            }
            Users toUpdate = userMapper.toEntity(request);
            toUpdate.setUserId(id);
            Users saved = userRepository.save(toUpdate);
            return userMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        userRepository.deleteById(id);
    }
}
