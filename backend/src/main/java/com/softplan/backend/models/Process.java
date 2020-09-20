package com.softplan.backend.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(	name = "process" )
public class Process {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 20)
	private String name;
	
	@NotBlank
	@Size(max = 255)
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private EStatus status;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(	name = "process_user", 
				joinColumns = @JoinColumn(name = "process_id"), 
				inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> users = new HashSet<>();
	
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
    @CreationTimestamp
    private LocalDateTime createDateTime;
 
    @UpdateTimestamp
    private LocalDateTime updateDateTime;
	
	public Process() {};

	public Process(@NotBlank @Size(max = 20) String name, @NotBlank @Size(max = 255) String description, EStatus status, Set<User> users, User user) {
		this.name = name;
		this.description = description;
		this.status = status;
		this.users = users;
		this.user = user;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public EStatus getStatus() {
		return status;
	}

	public void setStatus(EStatus status) {
		this.status = status;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	

}
