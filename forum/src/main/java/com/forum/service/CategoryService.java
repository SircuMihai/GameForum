package com.forum.service;

import com.forum.dto.mapper.CategoryMapper;
import com.forum.dto.request.CategoryRequest;
import com.forum.dto.response.CategoryResponse;
import com.forum.model.Categorys;
import com.forum.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<CategoryResponse> findById(Integer id) {
        return categoryRepository.findById(id).map(categoryMapper::toResponse);
    }

    public CategoryResponse create(CategoryRequest request) {
        Categorys entity = categoryMapper.toEntity(request);
        Categorys saved = categoryRepository.save(entity);
        return categoryMapper.toResponse(saved);
    }

    public Optional<CategoryResponse> update(Integer id, CategoryRequest request) {
        return categoryRepository.findById(id).map(existing -> {
            Categorys toUpdate = categoryMapper.toEntity(request);
            toUpdate.setCategoryId(id);
            Categorys saved = categoryRepository.save(toUpdate);
            return categoryMapper.toResponse(saved);
        });
    }

    public void delete(Integer id) {
        categoryRepository.deleteById(id);
    }
}
