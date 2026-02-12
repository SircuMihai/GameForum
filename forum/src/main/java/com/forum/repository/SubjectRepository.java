package com.forum.repository;

import com.forum.model.Subjects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subjects, Integer> {
    List<Subjects> findByCategory_CategoryId(Integer categoryId);
    List<Subjects> findByUser_UserId(Integer userId);
    long countByUser_UserId(Integer userId);
    long countByCategory_CategoryId(Integer categoryId);

    @Query("select count(distinct s.category.categoryId) from Subjects s where s.user.userId = :userId")
    long countDistinctCategoriesByUserId(@Param("userId") Integer userId);

    @Query("select s.category.categoryId, count(s) from Subjects s where s.category.categoryId in :categoryIds group by s.category.categoryId")
    List<Object[]> countByCategoryIds(@Param("categoryIds") List<Integer> categoryIds);
}
