package com.forum.controller;

import com.forum.service.MessageService;
import com.forum.model.Messages;
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
    public List<Messages> getAll() {
        return messageService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Messages> getById(@PathVariable Integer id) {
        return messageService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Messages> create(@RequestBody Messages message) {
        Messages created = messageService.create(message);
        return ResponseEntity.created(URI.create("/api/message/" + created.getMessageId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Messages> update(@PathVariable Integer id, @RequestBody Messages message) {
        if (messageService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(messageService.update(id, message));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (messageService.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
