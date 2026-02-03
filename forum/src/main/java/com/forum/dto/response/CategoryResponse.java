package com.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer categoryId;
    private String categoryName;
    private String categoryDescription;
    private String categoryIconName;
    private String categoryPhoto;
    private Long topicCount;
    private Long postCount;
}
