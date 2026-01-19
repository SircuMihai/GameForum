package com.forum.controller;

import com.forum.service.AchievementsUsersService;
import com.forum.dto.request.AchievementsUsersRequest;
import com.forum.dto.response.AchievementsUsersResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/achievementsusers")
public class AchievementsUsersController {

    @Autowired
    private AchievementsUsersService achievementsUsersService;

    @GetMapping
    public List<AchievementsUsersResponse> getAll() {
        return achievementsUsersService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchievementsUsersResponse> getById(@PathVariable Integer id) {
        return achievementsUsersService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AchievementsUsersResponse> create(@RequestBody AchievementsUsersRequest request) {
        AchievementsUsersResponse created = achievementsUsersService.create(request);
        return ResponseEntity.created(URI.create("/api/achievementsusers/" + created.getAchievementsUsersId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchievementsUsersResponse> update(@PathVariable Integer id, @RequestBody AchievementsUsersRequest request) {
        return achievementsUsersService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (achievementsUsersService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        achievementsUsersService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
