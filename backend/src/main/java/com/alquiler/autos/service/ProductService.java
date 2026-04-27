package com.alquiler.autos.service;

import com.alquiler.autos.dto.CategoryDTO;
import com.alquiler.autos.dto.FeatureDTO;
import com.alquiler.autos.dto.ProductRequestDTO;
import com.alquiler.autos.dto.ProductResponseDTO;
import com.alquiler.autos.exception.ResourceNotFoundException;
import com.alquiler.autos.model.Category;
import com.alquiler.autos.model.Feature;
import com.alquiler.autos.model.Product;
import com.alquiler.autos.repository.CategoryRepository;
import com.alquiler.autos.repository.FeatureRepository;
import com.alquiler.autos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FeatureRepository featureRepository;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) throws IOException {
        Product product = new Product();
        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());

        if (requestDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", requestDTO.getCategoryId()));
            product.setCategory(category);
        }

        List<String> imageUrls = saveImages(requestDTO.getImages());
        product.setImages(imageUrls);

        if (requestDTO.getFeatureIds() != null && !requestDTO.getFeatureIds().isEmpty()) {
            List<Feature> features = featureRepository.findAllById(requestDTO.getFeatureIds());
            product.setFeatures(features);
        }

        Product savedProduct = productRepository.save(product);
        return convertToResponseDTO(savedProduct);
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO requestDTO) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));

        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());

        if (requestDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", requestDTO.getCategoryId()));
            product.setCategory(category);
        }

        if (requestDTO.getImages() != null && requestDTO.getImages().length > 0) {
            List<String> imageUrls = saveImages(requestDTO.getImages());
            product.setImages(imageUrls);
        }

        if (requestDTO.getFeatureIds() != null) {
            List<Feature> features = featureRepository.findAllById(requestDTO.getFeatureIds());
            product.setFeatures(features);
        }

        Product updatedProduct = productRepository.save(product);
        return convertToResponseDTO(updatedProduct);
    }

    public List<ProductResponseDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        return convertToResponseDTO(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        productRepository.delete(product);
    }

    private List<String> saveImages(MultipartFile[] images) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : images) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            imageUrls.add("/uploads/" + fileName);
        }

        return imageUrls;
    }

    private ProductResponseDTO convertToResponseDTO(Product product) {
        ProductResponseDTO responseDTO = new ProductResponseDTO();
        responseDTO.setId(product.getId());
        responseDTO.setName(product.getName());
        responseDTO.setDescription(product.getDescription());
        responseDTO.setImages(product.getImages());

        if (product.getCategory() != null) {
            responseDTO.setCategory(convertCategoryToDTO(product.getCategory()));
        }

        if (product.getFeatures() != null && !product.getFeatures().isEmpty()) {
            List<FeatureDTO> featureDTOs = product.getFeatures().stream()
                    .map(this::convertFeatureToDTO)
                    .collect(Collectors.toList());
            responseDTO.setFeatures(featureDTOs);
        }

        return responseDTO;
    }

    private CategoryDTO convertCategoryToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        return dto;
    }

    private FeatureDTO convertFeatureToDTO(Feature feature) {
        FeatureDTO dto = new FeatureDTO();
        dto.setId(feature.getId());
        dto.setName(feature.getName());
        dto.setIcon(feature.getIcon());
        return dto;
    }
}