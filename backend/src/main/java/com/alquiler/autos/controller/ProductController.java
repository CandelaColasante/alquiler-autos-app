package com.alquiler.autos.controller;

import com.alquiler.autos.model.Product;
import com.alquiler.autos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping(consumes = "multipart/form-data")
    public Product createProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam("images") List<MultipartFile> images
    ) {

        List<String> imageNames = new ArrayList<>();

        String uploadDirPath = System.getProperty("user.dir") + "/uploads/";
        File uploadDir = new File(uploadDirPath);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : images) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            imageNames.add(fileName);

            try {
                file.transferTo(new File(uploadDirPath + fileName));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setImages(imageNames);

        return productService.saveProduct(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}