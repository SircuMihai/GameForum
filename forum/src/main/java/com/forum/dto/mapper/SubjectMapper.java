package com.forum.dto.mapper;

import com.forum.dto.request.SubjectRequest;
import com.forum.dto.response.SubjectResponse;
import com.forum.model.Subjects;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface SubjectMapper {

    @Mapping(target = "subjectId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "subjectPhoto", source = "subjectPhoto", qualifiedByName = "base64ToBytes")
    Subjects toEntity(SubjectRequest request);

    @Mapping(target = "categoryId", source = "category.categoryId")
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "userNickname", source = "user.nickname")
    @Mapping(target = "userAvatar", source = "user.avatar", qualifiedByName = "bytesToBase64")
    @Mapping(target = "userRole", expression = "java(entity.getUser() != null && entity.getUser().getRole() != null ? entity.getUser().getRole().toLowerCase() : null)")
    @Mapping(target = "replyCount", ignore = true)
    @Mapping(target = "subjectPhoto", source = "subjectPhoto", qualifiedByName = "bytesToBase64")
    SubjectResponse toResponse(Subjects entity);

    @Named("base64ToBytes")
    default byte[] base64ToBytes(String value) {
        if (value == null) return null;
        String v = value.trim();
        if (v.isEmpty()) return null;

        int comma = v.indexOf(',');
        if (v.startsWith("data:") && comma >= 0) {
            v = v.substring(comma + 1).trim();
        }

        return Base64.getDecoder().decode(v);
    }

    @Named("bytesToBase64")
    default String bytesToBase64(byte[] value) {
        if (value == null || value.length == 0) return null;
        return Base64.getEncoder().encodeToString(value);
    }
}
