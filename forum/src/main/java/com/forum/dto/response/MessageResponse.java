package com.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Integer messageId;
    private String messageText;
    private String messagesPhoto;
    private String messageLikes;
    private String createdAt;
    private Integer subjectId;
    private Integer userId;
    private String userNickname;
    private String userAvatar;
    private String userRole;
}
