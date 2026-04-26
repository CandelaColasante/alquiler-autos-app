package com.alquiler.autos.service;

import com.alquiler.autos.dto.ProductDTO;
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

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FeatureRepository featureRepository;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public Product createProduct(ProductDTO productDTO) throws IOException {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            product.setCategory(category);
        }

        List<String> imageUrls = saveImages(productDTO.getImages());
        product.setImages(imageUrls);

        if (productDTO.getFeatureIds() != null && !productDTO.getFeatureIds().isEmpty()) {
            List<Feature> features = featureRepository.findAllById(productDTO.getFeatureIds());
            product.setFeatures(features);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductDTO productDTO) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            product.setCategory(category);
        }

        if (productDTO.getImages() != null && productDTO.getImages().length > 0) {
            List<String> imageUrls = saveImages(productDTO.getImages());
            product.setImages(imageUrls);
        }

        if (productDTO.getFeatureIds() != null) {
            List<Feature> features = featureRepository.findAllById(productDTO.getFeatureIds());
            product.setFeatures(features);
        }

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
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
}