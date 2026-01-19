package com.forum.controller;

import com.forum.dto.request.LoginRequest;
import com.forum.dto.request.UserRequest;
import com.forum.dto.response.LoginResponse;
import com.forum.dto.response.UserResponse;
import com.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("api/auth")
public class AuthentificationController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRequest request) {
        UserResponse created = userService.create(request);
        return ResponseEntity.created(URI.create("/api/user/" + created.getUserId())).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        boolean ok = userService.authenticate(request.getEmail(), request.getPassword());
        if (!ok) {
            return ResponseEntity.status(401).body(new LoginResponse(false));
        }
        return ResponseEntity.ok(new LoginResponse(true));
    }
}
