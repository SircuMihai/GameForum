package com.forum.repository;

import com.forum.model.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Messages, Integer> {
    List<Messages> findBySubject_SubjectId(Integer subjectId);
    long countByUser_UserId(Integer userId);
    long countBySubject_SubjectId(Integer subjectId);
    long countBySubject_Category_CategoryId(Integer categoryId);

    @Transactional
    void deleteBySubject_SubjectId(Integer subjectId);

    @Query("select m.subject.subjectId, count(m) from Messages m where m.subject.subjectId in :subjectIds group by m.subject.subjectId")
    List<Object[]> countBySubjectIds(@Param("subjectIds") List<Integer> subjectIds);

    @Query("select m.subject.category.categoryId, count(m) from Messages m where m.subject.category.categoryId in :categoryIds group by m.subject.category.categoryId")
    List<Object[]> countByCategoryIds(@Param("categoryIds") List<Integer> categoryIds);
}
