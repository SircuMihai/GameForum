package com.forum.dto.mapper;

import com.forum.dto.request.AchievementRequest;
import com.forum.dto.response.AchievementResponse;
import com.forum.model.Achievements;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AchievementMapper {

    @Mapping(target = "achievementId", ignore = true)
    @Mapping(target = "achievementsUsers", ignore = true)
    Achievements toEntity(AchievementRequest request);

    AchievementResponse toResponse(Achievements entity);
}
