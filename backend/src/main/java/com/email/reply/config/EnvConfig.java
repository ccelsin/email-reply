package com.email.reply.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import java.io.File;

@Configuration(proxyBeanMethods = false)
public class EnvConfig {
    static {
        try {
            // Chercher le fichier .env dans le répertoire backend ou parent
            File backendDir = new File("backend");
            File envFile = new File(backendDir, ".env");
            
            // Si le répertoire backend n'existe pas, chercher dans le répertoire courant
            if (!backendDir.exists()) {
                envFile = new File(".env");
            }
            
            Dotenv dotenv = Dotenv.configure()
                    .directory(envFile.getParent() != null ? envFile.getParent() : ".")
                    .filename(".env")
                    .ignoreIfMissing()
                    .load();
            
            String apiUrl = dotenv.get("GEMINI_API_URL");
            String apiKey = dotenv.get("GEMINI_API_KEY");
            
            if (apiUrl != null && !apiUrl.isEmpty()) {
                System.setProperty("GEMINI_API_URL", apiUrl);
            }
            if (apiKey != null && !apiKey.isEmpty()) {
                System.setProperty("GEMINI_API_KEY", apiKey);
            }
        } catch (Exception e) {
            System.out.println("Warning: Could not load .env file. Make sure GEMINI_API_URL and GEMINI_API_KEY are set as environment variables.");
            e.printStackTrace();
        }
    }
}
