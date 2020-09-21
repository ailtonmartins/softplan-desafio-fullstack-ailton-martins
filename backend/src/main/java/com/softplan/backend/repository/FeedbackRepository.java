package com.softplan.backend.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softplan.backend.models.Feedback;
import com.softplan.backend.models.Process;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
	Page<Feedback> findAllByProcess(Process process , Pageable pageable);
	Page<Feedback> findAll(Pageable pageable);  
}