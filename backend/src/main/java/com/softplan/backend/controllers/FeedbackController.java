package com.softplan.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.softplan.backend.models.Feedback;
import com.softplan.backend.models.Process;
import com.softplan.backend.payload.request.FeedbackRequest;
import com.softplan.backend.repository.FeedbackRepository;
import com.softplan.backend.repository.ProcessRepository;
import com.softplan.backend.repository.UserRepository;
import com.softplan.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/process/{process}/feedback")
public class FeedbackController {
	
	@Autowired
	FeedbackRepository feedbackRepository;

	@Autowired
	ProcessRepository processRepository;

	@Autowired
	UserRepository userRepository;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> create(Authentication authentication, @PathVariable("process") Process process , @Valid @RequestBody FeedbackRequest newFeedback) {
		try {			
			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			Feedback feedback = new Feedback(newFeedback.getText(), process , userDetails.getUser());
			return new ResponseEntity<>(feedbackRepository.save(feedback), HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> index( @PathVariable("process") Process process , @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

		List<Feedback> feedback = new ArrayList<Feedback>();
		List<Order> orders = new ArrayList<Order>();

		orders.add(new Order(Sort.Direction.DESC, "id"));

		Pageable pagingSort = PageRequest.of(page, size, Sort.by(orders));

		Page<Feedback> pageFeedback = feedbackRepository.findAllByProcess( process, pagingSort);

		feedback = pageFeedback.getContent();

		if (feedback.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("feedback", feedback);
		response.put("currentPage", pageFeedback.getNumber());
		response.put("totalItems", pageFeedback.getTotalElements());
		response.put("totalPages", pageFeedback.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> update( @PathVariable("process") Process process , @PathVariable("id") long id, @RequestBody FeedbackRequest feedback) {
		try {
			Optional<Feedback> feedbackData = feedbackRepository.findById(id);
			if (feedbackData.isPresent()) {
				Feedback _feedback = feedbackData.get();			
				_feedback.setText(feedback.getText());				
				return new ResponseEntity<>(feedbackRepository.save(_feedback), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> show(@PathVariable("id") long id) {
		try {
			Optional<Feedback> feedbackData = feedbackRepository.findById(id);
			if (feedbackData.isPresent()) {
				Feedback _feedback = feedbackData.get();
				return new ResponseEntity<>(_feedback, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> delete(@PathVariable("id") long id) {
		try {
			feedbackRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}