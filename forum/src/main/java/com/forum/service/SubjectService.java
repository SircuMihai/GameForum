package com.forum.service;

import com.forum.repository.SubjectRepository;
import com.forum.model.Subjects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subjects> findAll() {
        return subjectRepository.findAll();
    }

    public Optional<Subjects> findById(Integer id) {
        return subjectRepository.findById(id);
    }

    public Subjects create(Subjects subject) {
        return subjectRepository.save(subject);
    }

    public Subjects update(Integer id, Subjects subject) {
        subject.setSubjectId(id);
        return subjectRepository.save(subject);
    }

    public void delete(Integer id) {
        subjectRepository.deleteById(id);
    }
}
