package com.alquiler.autos.dto;

import java.util.List;

public class ProductResponseDTO {

    private Long id;
    private String name;
    private String description;
    private List<String> images;
    private CategoryDTO category;
    private List<FeatureDTO> features;
    private boolean isFavorite;

    public ProductResponseDTO() {}

    public ProductResponseDTO(Long id, String name, String description,
                              List<String> images, CategoryDTO category,
                              List<FeatureDTO> features, boolean isFavorite) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.category = category;
        this.features = features;
        this.isFavorite = isFavorite;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public List<FeatureDTO> getFeatures() { return features; }
    public void setFeatures(List<FeatureDTO> features) { this.features = features; }

    public boolean isFavorite() { return isFavorite; }
    public void setFavorite(boolean favorite) { isFavorite = favorite; }

    private Double averageRating;
    private Long reviewCount;

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Long getReviewCount() { return reviewCount; }
    public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }
}
