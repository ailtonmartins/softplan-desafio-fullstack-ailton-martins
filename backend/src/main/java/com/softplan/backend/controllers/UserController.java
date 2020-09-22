package com.softplan.backend.controllers;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softplan.backend.models.ERole;
import com.softplan.backend.models.Role;
import com.softplan.backend.models.User;
import com.softplan.backend.payload.request.SignupRequest;
import com.softplan.backend.payload.response.MessageResponse;
import com.softplan.backend.repository.RoleRepository;
import com.softplan.backend.repository.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> create(@Valid @RequestBody SignupRequest signUpRequest) {
		try {
			if (userRepository.existsByUsername(signUpRequest.getUsername())) {
				return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
			}

			if (userRepository.existsByEmail(signUpRequest.getEmail())) {
				return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
			}

			// Create new user's account
			User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
					encoder.encode(signUpRequest.getPassword()));

			Set<String> strRoles = signUpRequest.getRole();
			Set<Role> roles = new HashSet<>();

			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);

					break;
				case "user":
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(userRole);
					break;
				case "triador":
					Role triadorRole = roleRepository.findByName(ERole.ROLE_TRIADOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(triadorRole);
					break;
				case "finalizador":
					Role finalizadorRole = roleRepository.findByName(ERole.ROLE_FINALIZADOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(finalizadorRole);
					break;
				default:
					new RuntimeException("Error: Role is not found.");
				}
			});

			user.setRoles(roles);

			return ResponseEntity.ok(userRepository.save(user));
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody SignupRequest signUpRequest) {
		try {
			Optional<User> userData = userRepository.findById(id);
			if (userData.isPresent()) {
				User _user = userData.get();

				Set<String> strRoles = signUpRequest.getRole();
				Set<Role> roles = new HashSet<>();

				strRoles.forEach(role -> {
					switch (role) {
					case "admin":
						Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(adminRole);

						break;
					case "user":
						Role userRole = roleRepository.findByName(ERole.ROLE_USER)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(userRole);
						break;
					case "triador":
						Role triadorRole = roleRepository.findByName(ERole.ROLE_TRIADOR)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(triadorRole);
						break;
					case "finalizador":
						Role finalizadorRole = roleRepository.findByName(ERole.ROLE_FINALIZADOR)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(finalizadorRole);
						break;
					default:
						new RuntimeException("Error: Role is not found.");
					}
				});

				_user.setRoles(roles);
				_user.setUsername(signUpRequest.getUsername());
				_user.setEmail(signUpRequest.getEmail());

				if (signUpRequest.getPassword() != null) {
					_user.setPassword(encoder.encode(signUpRequest.getPassword()));
				}

				return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('TRIADOR') ")
	public ResponseEntity<?> list() {
		return ResponseEntity.ok(userRepository.findAll());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> show(@PathVariable("id") long id) {
		try {
			Optional<User> userData = userRepository.findById(id);
			if (userData.isPresent()) {
				User _user = userData.get();
				return new ResponseEntity<>(_user, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}