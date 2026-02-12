package com.forum.dto.mapper;

import com.forum.dto.request.UserRequest;
import com.forum.dto.response.UserResponse;
import com.forum.model.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "subjects", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "achievementsUsers", ignore = true)
    @Mapping(target = "avatar", source = "avatar", qualifiedByName = "base64ToBytes")
    Users toEntity(UserRequest request);

    @Mapping(target = "selectedTitleAchievementId", source = "selectedTitleAchievement.achievementId")
    @Mapping(target = "selectedTitleName", source = "selectedTitleAchievement.achievementName")
    @Mapping(target = "avatar", source = "avatar", qualifiedByName = "bytesToBase64")
    UserResponse toResponse(Users entity);

    @Named("base64ToBytes")
    default byte[] base64ToBytes(String value) {
        if (value == null) return null;
        String v = value.trim();
        if (v.isEmpty()) return null;

        // Support data URLs: data:image/png;base64,....
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
