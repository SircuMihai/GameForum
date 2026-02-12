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
@Table(name = "subjects",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"category_id", "subject_name"})
        })
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Subjects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subject_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer subjectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Categorys category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users user;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "subject_text", nullable = false)
    private String subjectText;

    @Lob
    @Column(name = "subject_photo")
    private byte[] subjectPhoto;

    @Column(name = "created_at", nullable = false)
    private String createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Messages> messages =  new ArrayList<>();
}
