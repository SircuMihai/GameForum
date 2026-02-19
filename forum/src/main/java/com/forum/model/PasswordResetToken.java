package com.forum.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PasswordResetToken {

    private Integer tokenId;

    private String token;

    private Users user;

    private OffsetDateTime expiresAt;

    private boolean used = false;
}
