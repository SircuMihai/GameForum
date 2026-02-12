package com.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchievementResponse {
    private Integer achievementId;
    private String achievementName;
    private String achievementPhoto;
    private String achievementDescription;
}
