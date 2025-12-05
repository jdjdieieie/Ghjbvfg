package com.cts.promocode.exception;

public class PromoCodeAlreadyUsedException extends PromoCodeException {
    public PromoCodeAlreadyUsedException(String message) {
        super(message);
    }
}
