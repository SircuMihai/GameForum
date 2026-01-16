package com.forum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "achievements_users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Achievements_Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "achievements_users_id")
    private int messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "achievement_id", referencedColumnName = "achievement_id")
    private Achievements achievements;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users users;

    @Column(name = "obtain_at", nullable = false)
    private String obtainAt;
}
