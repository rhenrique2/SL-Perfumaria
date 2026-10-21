package br.com.slperfumaria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SlPerfumariaApplication {
    public static void main(String[] args) {
        SpringApplication.run(SlPerfumariaApplication.class, args);
    }
}
