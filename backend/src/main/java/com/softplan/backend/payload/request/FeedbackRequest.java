package com.softplan.backend.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class FeedbackRequest {
	
	@NotBlank
	@Size(max = 255)
	private String text;
	
	private Long process;
			
	private Long user;
			
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Long getProcess() {
		return process;
	}

	public void setProcess(Long process) {
		this.process = process;
	}

	public Long getUser() {
		return user;
	}

	public void setUser(Long user) {
		this.user = user;
	}	
	
}