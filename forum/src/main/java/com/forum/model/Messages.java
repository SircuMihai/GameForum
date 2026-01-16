package com.forum.model;

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
    private int messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id",  referencedColumnName = "subject_id")
    private Subjects subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users user;

    @Column(name = "message_text", nullable = false)
    private int messageText;

    @Lob
    @Column(name = "message_photo")
    private String messagesPhoto;

    @Column(name = "message_likes",  nullable = false)
    private String messageLikes;

    @Column(name = "created_at", nullable = false)
    private String createdAt;
}
