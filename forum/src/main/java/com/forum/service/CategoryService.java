package com.forum.service;

import com.forum.dto.mapper.CategoryMapper;
import com.forum.dto.request.CategoryRequest;
import com.forum.dto.response.CategoryResponse;
import com.forum.model.Categorys;
import com.forum.repository.CategoryRepository;
import com.forum.repository.MessageRepository;
import com.forum.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryResponse> findAll() {
        List<Categorys> categories = categoryRepository.findAll();

        List<Integer> categoryIds = categories.stream()
                .map(Categorys::getCategoryId)
                .collect(Collectors.toList());

        Map<Integer, Long> topicCounts = subjectRepository.countByCategoryIds(categoryIds).stream()
                .collect(Collectors.toMap(
                        r -> (Integer) r[0],
                        r -> (Long) r[1]
                ));

        Map<Integer, Long> postCounts = messageRepository.countByCategoryIds(categoryIds).stream()
                .collect(Collectors.toMap(
                        r -> (Integer) r[0],
                        r -> (Long) r[1]
                ));

        return categories.stream()
                .map(c -> {
                    CategoryResponse resp = categoryMapper.toResponse(c);
                    resp.setTopicCount(topicCounts.getOrDefault(c.getCategoryId(), 0L));
                    resp.setPostCount(postCounts.getOrDefault(c.getCategoryId(), 0L));
                    return resp;
                })
                .collect(Collectors.toList());
    }

    public Optional<CategoryResponse> findById(Integer id) {
        return categoryRepository.findById(id).map(c -> {
            CategoryResponse resp = categoryMapper.toResponse(c);
            resp.setTopicCount(subjectRepository.countByCategory_CategoryId(c.getCategoryId()));
            resp.setPostCount(messageRepository.countBySubject_Category_CategoryId(c.getCategoryId()));
            return resp;
        });
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
