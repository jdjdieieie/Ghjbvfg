package com.cts.exception;

public class FeedbackAlreadyProvidedException extends RuntimeException{
	public FeedbackAlreadyProvidedException(String message){
		super(message);
	}
}
