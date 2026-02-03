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
    private int subjectText;
    private String subjectPhoto;
    private String subjectLikes;
    private String createdAt;
    private Integer categoryId;
    private Integer userId;
}
