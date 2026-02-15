package com.forum.controller;

import com.forum.service.SubjectService;
import com.forum.dto.request.SubjectRequest;
import com.forum.dto.request.SetSubjectPhotoRequest;
import com.forum.dto.response.SubjectResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/subject")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<SubjectResponse> getAll() {
        return subjectService.findAll();
    }

    @GetMapping(params = "categoryId")
    public List<SubjectResponse> getAllByCategoryId(@RequestParam Integer categoryId) {
        return subjectService.findByCategoryId(categoryId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponse> getById(@PathVariable Integer id) {
        return subjectService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<SubjectResponse> create(@RequestBody SubjectRequest request) {
        SubjectResponse created = subjectService.create(request);
        return ResponseEntity.created(URI.create("/api/subject/" + created.getSubjectId())).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> update(@PathVariable Integer id, @RequestBody SubjectRequest request) {
        return subjectService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (subjectService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/photo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> setPhoto(@PathVariable Integer id, @RequestBody SetSubjectPhotoRequest request) {
        return subjectService.updatePhoto(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
