package com.forum.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "messages")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Messages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id",  referencedColumnName = "subject_id")
    private Subjects subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users user;

    @Column(name = "message_text", columnDefinition = "text", nullable = false)
    private String messageText;

    @Column(name = "created_at", nullable = false)
    private String createdAt;

    @Column(name = "messages_photo")
    private String messagesPhoto;
}
