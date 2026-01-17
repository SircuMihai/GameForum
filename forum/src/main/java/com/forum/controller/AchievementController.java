package com.forum.controller;

import com.forum.service.AchievementService;
import com.forum.dto.request.AchievementRequest;
import com.forum.dto.response.AchievementResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/achievement")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @GetMapping
    public List<AchievementResponse> getAll() {
        return achievementService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchievementResponse> getById(@PathVariable Integer id) {
        return achievementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AchievementResponse> create(@RequestBody AchievementRequest request) {
        AchievementResponse created = achievementService.create(request);
        return ResponseEntity.created(URI.create("/api/achievement/" + created.getAchievementId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchievementResponse> update(@PathVariable Integer id, @RequestBody AchievementRequest request) {
        return achievementService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (achievementService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        achievementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
