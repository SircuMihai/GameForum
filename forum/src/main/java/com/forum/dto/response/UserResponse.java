package com.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String nickname;
    private String avatar;
    private String userEmail;
    private String role;
    private Integer selectedTitleAchievementId;
    private String selectedTitleName;
    private String lastLogin;
    private String createdAt;
}
