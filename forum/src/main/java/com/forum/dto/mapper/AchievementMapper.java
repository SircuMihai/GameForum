package com.forum.dto.mapper;

import com.forum.dto.request.AchievementRequest;
import com.forum.dto.response.AchievementResponse;
import com.forum.model.Achievements;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AchievementMapper {

    @Mapping(target = "achievementId", ignore = true)
    @Mapping(target = "achievementsUsers", ignore = true)
    Achievements toEntity(AchievementRequest request);

    AchievementResponse toResponse(Achievements entity);

    @AfterMapping
    default void setDefaultPhotoIfMissing(@MappingTarget AchievementResponse response, Achievements entity) {
        if (response == null || entity == null) return;

        String photo = response.getAchievementPhoto();
        if (photo != null && !photo.trim().isEmpty()) return;

        String name = entity.getAchievementName();
        if (name == null || name.trim().isEmpty()) return;

        response.setAchievementPhoto("/Achievments/" + slugify(name) + ".png");
    }

    default String slugify(String value) {
        String v = value.trim().toLowerCase();
        v = v.replaceAll("[^a-z0-9]+", "_");
        v = v.replaceAll("_+", "_");
        v = v.replaceAll("^_", "");
        v = v.replaceAll("_$", "");
        return v;
    }
}
