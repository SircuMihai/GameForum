package com.forum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subjects")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Subjects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subject_id")
    private int subjectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Categorys category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users user;

    @Column(name = "subject_name", nullable = false, unique = true)
    private String subjectName;

    @Column(name = "subject_text", nullable = false)
    private int subjectText;

    @Lob
    @Column(name = "subject_photo")
    private String subjectPhoto;

    @Column(name = "subject_likes",  nullable = false)
    private String subjectLikes;

    @Column(name = "created_at", nullable = false)
    private String createdAt;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Messages> messages =  new ArrayList<>();
}
