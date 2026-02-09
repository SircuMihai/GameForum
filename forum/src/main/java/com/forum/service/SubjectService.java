package com.forum.service;

import com.forum.dto.mapper.SubjectMapper;
import com.forum.dto.request.SubjectRequest;
import com.forum.dto.response.SubjectResponse;
import com.forum.model.Categorys;
import com.forum.model.Subjects;
import com.forum.model.Users;
import com.forum.repository.CategoryRepository;
import com.forum.repository.MessageRepository;
import com.forum.repository.SubjectRepository;
import com.forum.repository.UserRepository;
import com.forum.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private AchievementsAwardService achievementsAwardService;

    public List<SubjectResponse> findAll() {
        List<Subjects> subjects = subjectRepository.findAll();

        List<Integer> subjectIds = subjects.stream()
                .map(Subjects::getSubjectId)
                .collect(Collectors.toList());

        Map<Integer, Long> replyCounts = messageRepository.countBySubjectIds(subjectIds).stream()
                .collect(Collectors.toMap(
                        r -> (Integer) r[0],
                        r -> (Long) r[1]
                ));

        return subjects.stream()
                .map(s -> {
                    SubjectResponse resp = subjectMapper.toResponse(s);
                    resp.setReplyCount(replyCounts.getOrDefault(s.getSubjectId(), 0L));
                    return resp;
                })
                .collect(Collectors.toList());
    }

    public List<SubjectResponse> findByCategoryId(Integer categoryId) {
        List<Subjects> subjects = subjectRepository.findByCategory_CategoryId(categoryId);

        List<Integer> subjectIds = subjects.stream()
                .map(Subjects::getSubjectId)
                .collect(Collectors.toList());

        Map<Integer, Long> replyCounts = messageRepository.countBySubjectIds(subjectIds).stream()
                .collect(Collectors.toMap(
                        r -> (Integer) r[0],
                        r -> (Long) r[1]
                ));

        return subjects.stream()
                .map(s -> {
                    SubjectResponse resp = subjectMapper.toResponse(s);
                    resp.setReplyCount(replyCounts.getOrDefault(s.getSubjectId(), 0L));
                    return resp;
                })
                .collect(Collectors.toList());
    }

    public Optional<SubjectResponse> findById(Integer id) {
        return subjectRepository.findById(id).map(s -> {
            SubjectResponse resp = subjectMapper.toResponse(s);
            resp.setReplyCount(messageRepository.countBySubject_SubjectId(s.getSubjectId()));
            return resp;
        });
    }

    public SubjectResponse create(SubjectRequest request) {
        Subjects entity = subjectMapper.toEntity(request);
        if (request.getUserId() != null) {
            Users user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new NotFoundException("User not found: " + request.getUserId()));
            entity.setUser(user);
        }
        if (request.getCategoryId() != null) {
            Categorys category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found: " + request.getCategoryId()));
            entity.setCategory(category);
        }
        Subjects saved = subjectRepository.save(entity);

        if (saved.getUser() != null) {
            achievementsAwardService.onSubjectCreated(saved.getUser().getUserId());
        }

        SubjectResponse resp = subjectMapper.toResponse(saved);
        resp.setReplyCount(messageRepository.countBySubject_SubjectId(saved.getSubjectId()));
        return resp;
    }

    public Optional<SubjectResponse> update(Integer id, SubjectRequest request) {
        return subjectRepository.findById(id).map(existing -> {
            Subjects toUpdate = subjectMapper.toEntity(request);
            toUpdate.setSubjectId(id);
            if (request.getUserId() != null) {
                Users user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new NotFoundException("User not found: " + request.getUserId()));
                toUpdate.setUser(user);
            }
            if (request.getCategoryId() != null) {
                Categorys category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new NotFoundException("Category not found: " + request.getCategoryId()));
                toUpdate.setCategory(category);
            }
            Subjects saved = subjectRepository.save(toUpdate);
            SubjectResponse resp = subjectMapper.toResponse(saved);
            resp.setReplyCount(messageRepository.countBySubject_SubjectId(saved.getSubjectId()));
            return resp;
        });
    }

    public void delete(Integer id) {
        subjectRepository.deleteById(id);
    }
}
