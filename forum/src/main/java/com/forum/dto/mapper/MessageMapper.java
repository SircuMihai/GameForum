package com.forum.dto.mapper;

import com.forum.dto.request.MessageRequest;
import com.forum.dto.response.MessageResponse;
import com.forum.model.Messages;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "messageId", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "user", ignore = true)
    Messages toEntity(MessageRequest request);

    @Mapping(target = "subjectId", source = "subject.subjectId")
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "userNickname", source = "user.nickname")
    @Mapping(target = "userAvatar", source = "user.avatar", qualifiedByName = "bytesToBase64")
    @Mapping(target = "userRole", expression = "java(entity.getUser() != null && entity.getUser().getRole() != null ? entity.getUser().getRole().toLowerCase() : null)")
    @Mapping(target = "userQuoto", source = "user.quoto")
    MessageResponse toResponse(Messages entity);

    @Named("bytesToBase64")
    default String bytesToBase64(byte[] value) {
        if (value == null || value.length == 0) return null;
        return Base64.getEncoder().encodeToString(value);
    }
}
