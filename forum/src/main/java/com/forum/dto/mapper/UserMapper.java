package com.forum.dto.mapper;

import com.forum.dto.request.UserRequest;
import com.forum.dto.response.UserResponse;
import com.forum.model.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "subjects", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "achievementsUsers", ignore = true)
    Users toEntity(UserRequest request);

    UserResponse toResponse(Users entity);
}
