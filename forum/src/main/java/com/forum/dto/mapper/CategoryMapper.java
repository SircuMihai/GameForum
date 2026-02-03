package com.forum.dto.mapper;

import com.forum.dto.request.CategoryRequest;
import com.forum.dto.response.CategoryResponse;
import com.forum.model.Categorys;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "subjects", ignore = true)
    Categorys toEntity(CategoryRequest request);

    @Mapping(target = "topicCount", ignore = true)
    @Mapping(target = "postCount", ignore = true)
    CategoryResponse toResponse(Categorys entity);
}
