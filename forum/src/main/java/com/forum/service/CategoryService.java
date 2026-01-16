package com.forum.service;

import com.forum.repository.CategoryRepository;
import com.forum.model.Categorys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Categorys> findAll() {
        return categoryRepository.findAll();
    }

    public Optional<Categorys> findById(Integer id) {
        return categoryRepository.findById(id);
    }

    public Categorys create(Categorys category) {
        return categoryRepository.save(category);
    }

    public Categorys update(Integer id, Categorys category) {
        category.setCategoryId(id);
        return categoryRepository.save(category);
    }

    public void delete(Integer id) {
        categoryRepository.deleteById(id);
    }
}
