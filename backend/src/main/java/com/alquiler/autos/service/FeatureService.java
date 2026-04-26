package com.alquiler.autos.service;

import com.alquiler.autos.model.Feature;
import com.alquiler.autos.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    public Feature getFeatureById(Long id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada"));
    }

    public Feature createFeature(Feature feature) {
        if (featureRepository.existsByName(feature.getName())) {
            throw new RuntimeException("Ya existe una característica con ese nombre");
        }
        return featureRepository.save(feature);
    }

    public Feature updateFeature(Long id, Feature featureDetails) {
        Feature feature = getFeatureById(id);
        feature.setName(featureDetails.getName());
        feature.setIcon(featureDetails.getIcon());
        return featureRepository.save(feature);
    }

    public void deleteFeature(Long id) {
        Feature feature = getFeatureById(id);
        featureRepository.delete(feature);
    }
}