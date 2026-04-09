package com.wellcampus.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class CommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;
    @Column(columnDefinition = "TEXT")
    private String text;
    private Integer likes;
    private Integer comments;
}
