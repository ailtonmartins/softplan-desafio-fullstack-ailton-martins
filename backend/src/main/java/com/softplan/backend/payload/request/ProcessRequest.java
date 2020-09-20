package com.softplan.backend.payload.request;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.softplan.backend.models.EStatus;

public class ProcessRequest {
	
	@NotBlank
	@Size(min = 6,max = 20)
	private String name;
	
	@NotBlank
	@Size(max = 255)
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private EStatus status;
	
	private Set<Long> user;

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

	public Set<Long> getUser() {
		return user;
	}

	public void setUser(Set<Long> user) {
		this.user = user;
	}
	
	
	
}