package com.alquiler.autos.controller;

import com.alquiler.autos.dto.ProductRequestDTO;
import com.alquiler.autos.dto.ProductResponseDTO;
import com.alquiler.autos.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestParam("name") String name,
            @Valid @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "featureIds", required = false) String featureIdsStr,
            @RequestParam("images") MultipartFile[] images) throws Exception {

        ProductRequestDTO requestDTO = new ProductRequestDTO();
        requestDTO.setName(name);
        requestDTO.setDescription(description);
        requestDTO.setCategoryId(categoryId);
        requestDTO.setImages(images);

        if (featureIdsStr != null && !featureIdsStr.isEmpty()) {
            List<Long> featureIds = Arrays.stream(featureIdsStr.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            requestDTO.setFeatureIds(featureIds);
        }

        ProductResponseDTO newProduct = productService.createProduct(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestParam("name") String name,
            @Valid @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "featureIds", required = false) String featureIdsStr,
            @RequestParam(value = "images", required = false) MultipartFile[] images) throws Exception {

        ProductRequestDTO requestDTO = new ProductRequestDTO();
        requestDTO.setName(name);
        requestDTO.setDescription(description);
        requestDTO.setCategoryId(categoryId);
        if (images != null) {
            requestDTO.setImages(images);
        }

        if (featureIdsStr != null && !featureIdsStr.isEmpty()) {
            List<Long> featureIds = Arrays.stream(featureIdsStr.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            requestDTO.setFeatureIds(featureIds);
        }

        ProductResponseDTO updatedProduct = productService.updateProduct(id, requestDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado correctamente"));
    }
}