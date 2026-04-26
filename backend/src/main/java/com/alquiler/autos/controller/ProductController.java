package com.alquiler.autos.controller;

import com.alquiler.autos.dto.ProductDTO;
import com.alquiler.autos.model.Product;
import com.alquiler.autos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
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
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "featureIds", required = false) String featureIdsStr,
            @RequestParam("images") MultipartFile[] images) {
        try {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(name);
            productDTO.setDescription(description);
            productDTO.setCategoryId(categoryId);
            productDTO.setImages(images);

            if (featureIdsStr != null && !featureIdsStr.isEmpty()) {
                List<Long> featureIds = Arrays.stream(featureIdsStr.split(","))
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
                productDTO.setFeatureIds(featureIds);
            }

            Product newProduct = productService.createProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "featureIds", required = false) String featureIdsStr,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        try {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(name);
            productDTO.setDescription(description);
            productDTO.setCategoryId(categoryId);
            if (images != null) {
                productDTO.setImages(images);
            }

            if (featureIdsStr != null && !featureIdsStr.isEmpty()) {
                List<Long> featureIds = Arrays.stream(featureIdsStr.split(","))
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
                productDTO.setFeatureIds(featureIds);
            }

            Product updatedProduct = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado correctamente"));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}