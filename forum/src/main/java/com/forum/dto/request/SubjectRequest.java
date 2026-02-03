package com.forum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectRequest {
    private String subjectName;
    private String subjectText;
    private String subjectPhoto;
    private String subjectLikes;
    private String createdAt;
    private Integer categoryId;
    private Integer userId;
}
