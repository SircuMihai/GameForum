package com.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {
    private Integer subjectId;
    private String subjectName;
    private String subjectText;
    private String subjectPhoto;
    private String subjectLikes;
    private String createdAt;
    private Integer categoryId;
    private Integer userId;
    private String userNickname;
    private String userAvatar;
    private String userRole;
    private Long replyCount;
}
