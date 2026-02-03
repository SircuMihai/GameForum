package com.forum.dto.mapper;

import com.forum.dto.request.SubjectRequest;
import com.forum.dto.response.SubjectResponse;
import com.forum.model.Subjects;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubjectMapper {

    @Mapping(target = "subjectId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "messages", ignore = true)
    Subjects toEntity(SubjectRequest request);

    @Mapping(target = "categoryId", source = "category.categoryId")
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "userNickname", source = "user.nickname")
    @Mapping(target = "userAvatar", source = "user.avatar")
    @Mapping(target = "userRole", expression = "java(entity.getUser() != null && entity.getUser().getRole() != null ? entity.getUser().getRole().toLowerCase() : null)")
    @Mapping(target = "replyCount", ignore = true)
    SubjectResponse toResponse(Subjects entity);
}
