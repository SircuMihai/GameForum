package com.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchievementsUsersResponse {
    private Integer achievementsUsersId;
    private Integer achievementId;
    private Integer userId;
    private String obtainAt;
}
