package com.forum.controller;

import com.forum.service.AchievementsUsersService;
import com.forum.model.AchievementsUsers;
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
    public List<AchievementsUsers> getAll() {
        return achievementsUsersService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchievementsUsers> getById(@PathVariable Integer id) {
        return achievementsUsersService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AchievementsUsers> create(@RequestBody AchievementsUsers au) {
        AchievementsUsers created = achievementsUsersService.create(au);
        return ResponseEntity.created(URI.create("/api/achievementsusers/" + created.getMessageId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchievementsUsers> update(@PathVariable Integer id, @RequestBody AchievementsUsers au) {
        if (achievementsUsersService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(achievementsUsersService.update(id, au));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (achievementsUsersService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        achievementsUsersService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
