package com.softplan.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

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

import com.softplan.backend.models.EStatus;
import com.softplan.backend.models.Process;
import com.softplan.backend.models.User;
import com.softplan.backend.payload.request.ProcessRequest;
import com.softplan.backend.payload.response.MessageResponse;
import com.softplan.backend.repository.ProcessRepository;
import com.softplan.backend.repository.UserRepository;
import com.softplan.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/process")
public class ProcessController {

	@Autowired
	ProcessRepository processRepository;

	@Autowired
	UserRepository userRepository;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> create(Authentication authentication, @Valid @RequestBody ProcessRequest newProcess) {
		try {
			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

			Set<User> users = new HashSet<>();
			for (Long id : newProcess.getUser()) {
				User user = userRepository.findById(id).orElse(null);
				if (user != null) {
					users.add(user);
				} else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST)
							.body(new MessageResponse("Error: User (" + id + ") not exist!"));
				}
			}

			Process process = new Process(newProcess.getName(), newProcess.getDescription(), newProcess.getStatus(),
					users, userDetails.getUser());
			return new ResponseEntity<>(processRepository.save(process), HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> index(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

		List<Process> process = new ArrayList<Process>();
		List<Order> orders = new ArrayList<Order>();

		orders.add(new Order(Sort.Direction.DESC, "id"));

		Pageable pagingSort = PageRequest.of(page, size, Sort.by(orders));

		Page<Process> pageProcess = processRepository.findAll(pagingSort);

		process = pageProcess.getContent();

		if (process.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("process", pageProcess.getContent());
		response.put("currentPage", pageProcess.getNumber());
		response.put("totalItems", pageProcess.getTotalElements());
		response.put("totalPages", pageProcess.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody ProcessRequest process) {
		try {
			Optional<Process> processData = processRepository.findById(id);
			if (processData.isPresent()) {
				Process _process = processData.get();

				Set<User> users = new HashSet<>();
				for (Long idUser : process.getUser()) {
					User user = userRepository.findById(idUser).orElse(null);
					if (user != null) {
						users.add(user);
					} else {
						return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new MessageResponse("Error: User (" + idUser + ") not exist!"));
					}
				}

				_process.setName(process.getName());
				_process.setDescription(process.getDescription());
				_process.setStatus(process.getStatus());
				_process.setUsers(users);

				return new ResponseEntity<>(processRepository.save(_process), HttpStatus.OK);
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
			Optional<Process> processData = processRepository.findById(id);
			if (processData.isPresent()) {
				Process _process = processData.get();
				return new ResponseEntity<>(_process, HttpStatus.OK);
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
			processRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PutMapping("/{id}/finish")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> finish(@PathVariable("id") long id) {
		try {
			Optional<Process> processData = processRepository.findById(id);
			if (processData.isPresent()) {
				Process _process = processData.get();
				_process.setStatus( EStatus.STATUS_FINISH );
     			return new ResponseEntity<>(processRepository.save(_process), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}