package com.forum.dto.mapper;

import com.forum.dto.request.MessageRequest;
import com.forum.dto.response.MessageResponse;
import com.forum.model.Messages;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "messageId", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "user", ignore = true)
    Messages toEntity(MessageRequest request);

    @Mapping(target = "subjectId", source = "subject.subjectId")
    @Mapping(target = "userId", source = "user.userId")
    MessageResponse toResponse(Messages entity);
}
