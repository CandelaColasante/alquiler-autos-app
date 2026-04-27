
package com.alquiler.autos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class FeatureDTO {

    private Long id;

    @NotBlank(message = "El nombre de la característica es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @NotBlank(message = "El icono es obligatorio")
    @Pattern(regexp = "^fa-[a-z0-9-]+$", message = "El icono debe ser una clase válida de FontAwesome (ej: fa-snowflake)")
    private String icon;

    public FeatureDTO() {}

    public FeatureDTO(Long id, String name, String icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}