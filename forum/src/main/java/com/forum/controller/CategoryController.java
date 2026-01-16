package com.forum.controller;

import com.forum.service.CategoryService;
import com.forum.model.Categorys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Categorys> getAll() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorys> getById(@PathVariable Integer id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categorys> create(@RequestBody Categorys category) {
        Categorys created = categoryService.create(category);
        return ResponseEntity.created(URI.create("/api/category/" + created.getCategoryId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorys> update(@PathVariable Integer id, @RequestBody Categorys category) {
        if (categoryService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(categoryService.update(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (categoryService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
