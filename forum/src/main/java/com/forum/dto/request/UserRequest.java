package com.forum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String nickname;
    private String avatar;
    private String password;
    private String userEmail;
    private String role;
    private String lastLogin;
    private String createdAt;
}
