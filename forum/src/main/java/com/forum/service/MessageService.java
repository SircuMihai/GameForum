package com.forum.service;

import com.forum.dto.mapper.MessageMapper;
import com.forum.dto.request.MessageRequest;
import com.forum.dto.response.MessageResponse;
import com.forum.model.Messages;
import com.forum.model.Subjects;
import com.forum.model.Users;
import com.forum.repository.MessageRepository;
import com.forum.repository.SubjectRepository;
import com.forum.repository.UserRepository;
import com.forum.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private AchievementsAwardService achievementsAwardService;

    public List<MessageResponse> findAll() {
        return messageRepository.findAll().stream()
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<MessageResponse> findBySubjectId(Integer subjectId) {
        return messageRepository.findBySubject_SubjectId(subjectId).stream()
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<MessageResponse> findById(Integer id) {
        return messageRepository.findById(id).map(messageMapper::toResponse);
    }

    public MessageResponse create(MessageRequest request) {
        Messages entity = messageMapper.toEntity(request);
        if (request.getSubjectId() != null) {
            Subjects subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new NotFoundException("Subject not found: " + request.getSubjectId()));
            entity.setSubject(subject);
        }
        if (request.getUserId() != null) {
            Users user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new NotFoundException("User not found: " + request.getUserId()));
            entity.setUser(user);
        }
        Messages saved = messageRepository.save(entity);

        Integer userId = saved.getUser() != null ? saved.getUser().getUserId() : null;
        Integer subjectId = saved.getSubject() != null ? saved.getSubject().getSubjectId() : null;
        achievementsAwardService.onMessageCreated(userId, subjectId);

        return messageMapper.toResponse(saved);
    }

    public Optional<MessageResponse> update(Integer id, MessageRequest request) {
        return messageRepository.findById(id).map(existing -> {
            Messages toUpdate = messageMapper.toEntity(request);
            toUpdate.setMessageId(id);
            if (request.getSubjectId() != null) {
                Subjects subject = subjectRepository.findById(request.getSubjectId())
                        .orElseThrow(() -> new NotFoundException("Subject not found: " + request.getSubjectId()));
                toUpdate.setSubject(subject);
            }
            if (request.getUserId() != null) {
                Users user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new NotFoundException("User not found: " + request.getUserId()));
                toUpdate.setUser(user);
            }
            Messages saved = messageRepository.save(toUpdate);
            return messageMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        messageRepository.deleteById(id);
    }
}
