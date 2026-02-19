package com.forum.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer userId;

    @Column(name = "nickname", nullable = false, unique = true)
    private String nickname;

    @Column(name = "avatar", columnDefinition = "bytea")
    private byte[] avatar;

    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "banned", nullable = false, columnDefinition = "boolean default false")
    private boolean banned = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_title_achievement_id", referencedColumnName = "achievement_id")
    private Achievements selectedTitleAchievement;

    @Column(name = "last_login")
    private String lastLogin;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "quoto")
    private String quoto;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Subjects> subjects =  new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Messages> messages =  new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.DETACH, orphanRemoval = true)
    private List<AchievementsUsers> achievementsUsers = new ArrayList<>();
}
