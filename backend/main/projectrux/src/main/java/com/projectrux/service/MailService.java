package com.projectrux.service;

public interface MailService {

    public void sendOtpMail(String to, String subject, String otp);
}
