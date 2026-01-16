package com.forum.controller;

import com.forum.service.AchievementService;
import com.forum.model.Achievements;
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
    public List<Achievements> getAll() {
        return achievementService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Achievements> getById(@PathVariable Integer id) {
        return achievementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Achievements> create(@RequestBody Achievements achievement) {
        Achievements created = achievementService.create(achievement);
        return ResponseEntity.created(URI.create("/api/achievement/" + created.getAchievementId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Achievements> update(@PathVariable Integer id, @RequestBody Achievements achievement) {
        if (achievementService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(achievementService.update(id, achievement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (achievementService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        achievementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
