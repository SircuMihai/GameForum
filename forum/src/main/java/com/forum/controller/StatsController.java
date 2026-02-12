package com.forum.controller;

import com.forum.dto.response.ForumStatsResponse;
import com.forum.repository.MessageRepository;
import com.forum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/stats")
public class StatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping
    public ForumStatsResponse getStats() {
        long members = userRepository.count();
        long posts = messageRepository.count();
        return new ForumStatsResponse(members, posts);
    }
}
