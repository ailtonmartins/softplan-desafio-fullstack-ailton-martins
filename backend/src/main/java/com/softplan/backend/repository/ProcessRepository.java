package com.softplan.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softplan.backend.models.Process;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Long> {
	Page<Process> findAll(Pageable pageable);  
}