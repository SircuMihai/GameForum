package com.forum.controller;

import com.forum.service.SubjectService;
import com.forum.model.Subjects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/subject")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<Subjects> getAll() {
        return subjectService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subjects> getById(@PathVariable Integer id) {
        return subjectService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Subjects> create(@RequestBody Subjects subject) {
        Subjects created = subjectService.create(subject);
        return ResponseEntity.created(URI.create("/api/subject/" + created.getSubjectId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subjects> update(@PathVariable Integer id, @RequestBody Subjects subject) {
        if (subjectService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(subjectService.update(id, subject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (subjectService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
