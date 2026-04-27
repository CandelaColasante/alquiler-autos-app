package com.alquiler.autos.service;

import com.alquiler.autos.dto.FeatureDTO;
import com.alquiler.autos.model.Feature;
import com.alquiler.autos.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    public List<FeatureDTO> getAllFeatures() {
        List<Feature> features = featureRepository.findAll();
        return features.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FeatureDTO getFeatureById(Long id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada"));
        return convertToDTO(feature);
    }

    public FeatureDTO createFeature(FeatureDTO featureDTO) {
        if (featureRepository.existsByName(featureDTO.getName())) {
            throw new RuntimeException("Ya existe una característica con ese nombre");
        }

        Feature feature = convertToEntity(featureDTO);
        Feature savedFeature = featureRepository.save(feature);
        return convertToDTO(savedFeature);
    }

    public FeatureDTO updateFeature(Long id, FeatureDTO featureDTO) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada"));

        feature.setName(featureDTO.getName());
        feature.setIcon(featureDTO.getIcon());

        Feature updatedFeature = featureRepository.save(feature);
        return convertToDTO(updatedFeature);
    }

    public void deleteFeature(Long id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada"));
        featureRepository.delete(feature);
    }

    private FeatureDTO convertToDTO(Feature feature) {
        return new FeatureDTO(
                feature.getId(),
                feature.getName(),
                feature.getIcon()
        );
    }

    private Feature convertToEntity(FeatureDTO featureDTO) {
        Feature feature = new Feature();
        feature.setName(featureDTO.getName());
        feature.setIcon(featureDTO.getIcon());
        return feature;
    }
}