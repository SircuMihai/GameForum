package com.forum.security;

import com.forum.exception.ErrorMessages;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String message = accessDeniedException.getMessage() != null && !accessDeniedException.getMessage().isEmpty()
                ? accessDeniedException.getMessage()
                : ErrorMessages.ACCESS_DENIED;
        response.getWriter().write(String.format(
                "{\"error\":\"Forbidden\",\"message\":\"%s\",\"status\":403}",
                message.replace("\"", "\\\"")
        ));
    }
}
