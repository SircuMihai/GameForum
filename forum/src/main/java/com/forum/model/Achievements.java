package com.forum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "achievements")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Achievements {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "achievement_id")
    private int achievementId;

    @Column(name = "achievement_name", nullable = false, unique = true)
    private String achievementName;

    @Lob
    @Column(name = "achievement_photo", nullable = false)
    private String achievementPhoto;

    @Column(name = "achievement_xp_value", nullable = false)
    private String achievementXPValue;

    @OneToMany(mappedBy = "achievements", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Achievements_Users> achievementsUsers = new ArrayList<>();
}
