package com.forum.service;

import com.forum.repository.MessageRepository;
import com.forum.model.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Messages> findAll() {
        return messageRepository.findAll();
    }

    public Optional<Messages> findById(Integer id) {
        return messageRepository.findById(id);
    }

    public Messages create(Messages message) {
        return messageRepository.save(message);
    }

    public Messages update(Integer id, Messages message) {
        message.setMessageId(id);
        return messageRepository.save(message);
    }

    public void delete(Integer id) {
        messageRepository.deleteById(id);
    }
}
