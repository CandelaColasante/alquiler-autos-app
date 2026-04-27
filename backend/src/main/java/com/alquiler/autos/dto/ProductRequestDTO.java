package com.alquiler.autos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ProductRequestDTO {

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 1000, message = "La descripción debe tener entre 10 y 1000 caracteres")
    private String description;

    @NotNull(message = "Debe seleccionar una categoría")
    private Long categoryId;

    private MultipartFile[] images;

    private List<Long> featureIds;

    public ProductRequestDTO() {}

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