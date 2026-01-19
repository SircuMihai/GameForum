package com.forum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchievementsUsersRequest {
    private Integer achievementId;
    private Integer userId;
    private String obtainAt;
}
