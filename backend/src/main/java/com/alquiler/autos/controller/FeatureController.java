package com.alquiler.autos.controller;

import com.alquiler.autos.dto.FeatureDTO;
import com.alquiler.autos.service.FeatureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "http://localhost:5173")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping
    public ResponseEntity<List<FeatureDTO>> getAllFeatures() {
        return ResponseEntity.ok(featureService.getAllFeatures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeatureDTO> getFeatureById(@PathVariable Long id) {
        return ResponseEntity.ok(featureService.getFeatureById(id));
    }

    @PostMapping
    public ResponseEntity<FeatureDTO> createFeature(@Valid @RequestBody FeatureDTO featureDTO) {
        FeatureDTO newFeature = featureService.createFeature(featureDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newFeature);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeatureDTO> updateFeature(@PathVariable Long id,
                                                    @Valid @RequestBody FeatureDTO featureDTO) {
        FeatureDTO updatedFeature = featureService.updateFeature(id, featureDTO);
        return ResponseEntity.ok(updatedFeature);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeature(@PathVariable Long id) {
        featureService.deleteFeature(id);
        return ResponseEntity.ok(Map.of("message", "Característica eliminada correctamente"));
    }
}