package com.forum.controller;

import com.forum.service.MessageService;
import com.forum.dto.request.MessageRequest;
import com.forum.dto.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    public List<MessageResponse> getAll() {
        return messageService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageResponse> getById(@PathVariable Integer id) {
        return messageService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MessageResponse> create(@RequestBody MessageRequest request) {
        MessageResponse created = messageService.create(request);
        return ResponseEntity.created(URI.create("/api/message/" + created.getMessageId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> update(@PathVariable Integer id, @RequestBody MessageRequest request) {
        return messageService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (messageService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
