package com.forum.service;

import com.forum.dto.mapper.SubjectMapper;
import com.forum.dto.request.SubjectRequest;
import com.forum.dto.response.SubjectResponse;
import com.forum.model.Categorys;
import com.forum.model.Subjects;
import com.forum.model.Users;
import com.forum.repository.CategoryRepository;
import com.forum.repository.SubjectRepository;
import com.forum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubjectMapper subjectMapper;

    public List<SubjectResponse> findAll() {
        return subjectRepository.findAll().stream()
                .map(subjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<SubjectResponse> findById(Integer id) {
        return subjectRepository.findById(id).map(subjectMapper::toResponse);
    }

    public SubjectResponse create(SubjectRequest request) {
        Subjects entity = subjectMapper.toEntity(request);
        if (request.getUserId() != null) {
            Users user = userRepository.findById(request.getUserId()).orElseThrow();
            entity.setUser(user);
        }
        if (request.getCategoryId() != null) {
            Categorys category = categoryRepository.findById(request.getCategoryId()).orElseThrow();
            entity.setCategory(category);
        }
        Subjects saved = subjectRepository.save(entity);
        return subjectMapper.toResponse(saved);
    }

    public Optional<SubjectResponse> update(Integer id, SubjectRequest request) {
        return subjectRepository.findById(id).map(existing -> {
            Subjects toUpdate = subjectMapper.toEntity(request);
            toUpdate.setSubjectId(id);
            if (request.getUserId() != null) {
                Users user = userRepository.findById(request.getUserId()).orElseThrow();
                toUpdate.setUser(user);
            }
            if (request.getCategoryId() != null) {
                Categorys category = categoryRepository.findById(request.getCategoryId()).orElseThrow();
                toUpdate.setCategory(category);
            }
            Subjects saved = subjectRepository.save(toUpdate);
            return subjectMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        subjectRepository.deleteById(id);
    }
}
