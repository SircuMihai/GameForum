package com.forum.controller;

import com.forum.dto.request.LoginRequest;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.LoginResponse;
import com.forum.dto.response.UserResponse;
import com.forum.dto.mapper.UserMapper;
import com.forum.repository.UserRepository;
import com.forum.repository.UserAuthView;
import com.forum.security.JwtTokenStore;
import com.forum.security.JwtUtil;
import com.forum.service.AchievementsAwardService;
import com.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.OffsetDateTime;

@RestController
@RequestMapping("api/auth")
public class AuthentificationController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtTokenStore jwtTokenStore;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private AchievementsAwardService achievementsAwardService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRequest request) {
        if (request != null) {
            request.setRole(null);
        }
        UserResponse created = userService.create(request);
        return ResponseEntity.created(URI.create("/api/user/" + created.getUserId())).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new LoginResponse(false, null));
            }

            UserAuthView user = userRepository.findAuthViewByUserEmail(request.getEmail()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, null));
            }

            if (user.isBanned()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new LoginResponse(false, null));
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

            jwtTokenStore.revokeTokensByUsername(user.getUserEmail());
            String token = jwtUtil.generateToken(userDetails);
            jwtTokenStore.storeToken(token, user.getUserId(), user.getUserEmail());

            userRepository.findById(user.getUserId()).ifPresent(u -> {
                String now = OffsetDateTime.now().toString();
                u.setLastLogin(now);
                if (u.getCreatedAt() == null) {
                    u.setCreatedAt(now);
                }
                userRepository.save(u);
            });

            achievementsAwardService.onUserLogin(user.getUserId());

            return ResponseEntity.ok(new LoginResponse(true, token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, null));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new LoginResponse(false, null));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userRepository.findByUserEmail(authentication.getName())
                .map(userMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
