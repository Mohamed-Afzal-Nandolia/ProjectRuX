package com.projectrux.service.impl;

import com.projectrux.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpMail(String to, String subject, String otp){
        try{
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(otp);
            javaMailSender.send(mail);
        } catch (Exception e){
            System.err.println("Exception while sendEmail " + e);
        }
    }
}
