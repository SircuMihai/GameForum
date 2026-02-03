package com.forum.dto.mapper;

import com.forum.dto.request.AchievementsUsersRequest;
import com.forum.dto.response.AchievementsUsersResponse;
import com.forum.model.AchievementsUsers;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AchievementsUsersMapper {

    @Mapping(target = "achievementsUsersId", ignore = true)
    @Mapping(target = "achievements", ignore = true)
    @Mapping(target = "users", ignore = true)
    AchievementsUsers toEntity(AchievementsUsersRequest request);

    @Mapping(target = "achievementsUsersId", source = "achievementsUsersId")
    @Mapping(target = "achievementId", source = "achievements.achievementId")
    @Mapping(target = "userId", source = "users.userId")
    AchievementsUsersResponse toResponse(AchievementsUsers entity);
}
