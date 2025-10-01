package com.projectrux.scheduler;

import com.projectrux.repository.OtpRepository;
import com.projectrux.repository.PasswordResetTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Slf4j
@Component
public class CronJob {

    @Autowired
    OtpRepository otpRepository;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${backend.url}")
    String backendUrl;

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

//    @Scheduled(cron = "0 * * * * ?")
    @Scheduled(cron = "0 */10 * * * ?")
    public void pingCheckAlive() {
        String url = backendUrl + "auth/check-alive";
        try {
            String response = restTemplate.getForObject(url, String.class);
            log.info("Pinged /auth/check-alive -> Response: {}", response);
        } catch (Exception e) {
            log.error("Error while pinging /auth/check-alive: {}", e.getMessage(), e);
        }
    }

}