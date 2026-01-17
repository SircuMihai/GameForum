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

    @Lob
    @Column(name = "avatar")
    private String avatar;

    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "user_level", nullable = false)
    private String userLevel;

    @Column(name = "user_xp", nullable = false)
    private String userXP;

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "last_login")
    private String lastLogin;

    @Column(name = "created_at")
    private String createdAt;

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
