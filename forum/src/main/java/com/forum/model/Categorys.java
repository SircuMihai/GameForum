package com.forum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Categorys {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId;

    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    @Lob
    @Column(name = "category_photo")
    private String categoryPhoto;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Subjects> subjects =  new ArrayList<>();
}
