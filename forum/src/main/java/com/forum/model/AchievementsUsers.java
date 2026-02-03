package com.forum.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "achievements_users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"achievement_id", "user_id"})
        })
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AchievementsUsers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "achievements_users_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer achievementsUsersId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "achievement_id", referencedColumnName = "achievement_id")
    private Achievements achievements;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users users;

    @Column(name = "obtain_at", nullable = false)
    private String obtainAt;
}
