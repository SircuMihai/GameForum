package com.forum.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer achievementId;

    @Column(name = "achievement_name", nullable = false, unique = true)
    private String achievementName;

    @Lob
    @Column(name = "achievement_photo", nullable = false)
    private String achievementPhoto;

    @Column(name = "achievement_xp_value", nullable = false)
    private String achievementXPValue;

    @JsonIgnore
    @OneToMany(mappedBy = "achievements", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AchievementsUsers> achievementsUsers = new ArrayList<>();
}
