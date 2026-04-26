package com.alquiler.autos.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ProductDTO {
    private String name;
    private String description;
    private Long categoryId;
    private MultipartFile[] images;
    private List<Long> featureIds;

    public ProductDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public MultipartFile[] getImages() { return images; }
    public void setImages(MultipartFile[] images) { this.images = images; }

    public List<Long> getFeatureIds() { return featureIds; }
    public void setFeatureIds(List<Long> featureIds) { this.featureIds = featureIds; }
}