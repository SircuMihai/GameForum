package com.forum.controller;

import com.forum.dto.request.LoginRequest;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.LoginResponse;
import com.forum.dto.response.UserResponse;
import com.forum.repository.UserRepository;
import com.forum.repository.UserAuthView;
import com.forum.security.JwtTokenStore;
import com.forum.security.JwtUtil;
import com.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

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

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRequest request) {
        UserResponse created = userService.create(request);
        return ResponseEntity.created(URI.create("/api/user/" + created.getUserId())).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            UserAuthView user = userRepository.findAuthViewByUserEmail(request.getEmail()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, null));
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

            jwtTokenStore.revokeTokensByUsername(user.getUserEmail());
            String token = jwtUtil.generateToken(userDetails);
            jwtTokenStore.storeToken(token, user.getUserId(), user.getUserEmail());

            return ResponseEntity.ok(new LoginResponse(true, token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, null));
        }
    }
}
