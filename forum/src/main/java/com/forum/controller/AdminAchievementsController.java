package com.forum.controller;

import com.forum.service.AchievementsAwardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin/achievements")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAchievementsController {

    @Autowired
    private AchievementsAwardService achievementsAwardService;

    @PostMapping("/recalculate")
    public ResponseEntity<Void> recalculateAll() {
        achievementsAwardService.recalculateAll();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/recalculate/{userId}")
    public ResponseEntity<Void> recalculateForUser(@PathVariable Integer userId) {
        achievementsAwardService.recalculateForUser(userId);
        return ResponseEntity.noContent().build();
    }
}
