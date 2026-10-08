package com.unimanagement.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.unimanagement.ai.model.LearningProgress;

public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

}