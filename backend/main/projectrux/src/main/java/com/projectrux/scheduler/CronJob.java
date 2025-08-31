package com.projectrux.scheduler;

import com.projectrux.repository.OtpRepository;
import com.projectrux.repository.PasswordResetTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class CronJob {

    @Autowired
    OtpRepository otpRepository;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Scheduled(cron = "0 0 * * * ?")
    public void deleteOtp() {
        LocalDateTime now = LocalDateTime.now();
        long deletedCount = otpRepository.deleteByExpiryTimeBefore(now);
        log.info("Deleted {} expired OTPs at {}", deletedCount, now);
    }

    @Scheduled(cron = "0 * * * * ?")
    public void deleteResetToken() {
        LocalDateTime now = LocalDateTime.now();
        long deletedCount = passwordResetTokenRepository.deleteByExpiryTimeBefore(now);
        System.out.println("Scheduled job triggered at " + now);
        log.info("Deleted {} expired Tokens at {}", deletedCount, now);
    }
}