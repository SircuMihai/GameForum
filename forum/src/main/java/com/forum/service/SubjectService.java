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
import com.forum.exception.ErrorMessages;
import com.forum.security.HtmlSanitizer;
import com.forum.dto.request.SetSubjectPhotoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        entity.setSubjectText(HtmlSanitizer.sanitize(entity.getSubjectText()));
        if (request.getUserId() != null) {
            Users user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new NotFoundException(
                            ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_ID, request.getUserId())));
            if (user.isBanned()) {
                throw new AccessDeniedException("Cont banat");
            }
            entity.setUser(user);
        }
        if (request.getCategoryId() != null) {
            Categorys category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new NotFoundException(
                            ErrorMessages.format(ErrorMessages.CATEGORY_NOT_FOUND_BY_ID, request.getCategoryId())));
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
            toUpdate.setSubjectText(HtmlSanitizer.sanitize(toUpdate.getSubjectText()));
            if (request.getUserId() != null) {
                Users user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new NotFoundException(
                                ErrorMessages.format(ErrorMessages.USER_NOT_FOUND_BY_ID, request.getUserId())));
                if (user.isBanned()) {
                    throw new AccessDeniedException("Cont banat");
                }
                toUpdate.setUser(user);
            }
            if (request.getCategoryId() != null) {
                Categorys category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new NotFoundException(
                                ErrorMessages.format(ErrorMessages.CATEGORY_NOT_FOUND_BY_ID, request.getCategoryId())));
                toUpdate.setCategory(category);
            }
            Subjects saved = subjectRepository.save(toUpdate);
            SubjectResponse resp = subjectMapper.toResponse(saved);
            resp.setReplyCount(messageRepository.countBySubject_SubjectId(saved.getSubjectId()));
            return resp;
        });
    }

    public Optional<SubjectResponse> updatePhoto(Integer id, SetSubjectPhotoRequest request) {
        return subjectRepository.findById(id).map(existing -> {
            String photo = request != null ? request.getSubjectPhoto() : null;
            existing.setSubjectPhoto(subjectMapper.base64ToBytes(photo));
            Subjects saved = subjectRepository.save(existing);
            SubjectResponse resp = subjectMapper.toResponse(saved);
            resp.setReplyCount(messageRepository.countBySubject_SubjectId(saved.getSubjectId()));
            return resp;
        });
    }

    @Transactional
    public void delete(Integer id) {
        messageRepository.deleteBySubject_SubjectId(id);
        subjectRepository.deleteById(id);
    }

    public Optional<SubjectResponse> setClosed(Integer id, boolean closed) {
        return subjectRepository.findById(id).map(existing -> {
            existing.setSubjectClosed(closed);
            Subjects saved = subjectRepository.save(existing);
            SubjectResponse resp = subjectMapper.toResponse(saved);
            resp.setReplyCount(messageRepository.countBySubject_SubjectId(saved.getSubjectId()));
            return resp;
        });
    }
}
