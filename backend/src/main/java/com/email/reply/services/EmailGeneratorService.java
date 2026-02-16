package com.email.reply.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.reply.entities.EmailRequest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest){
        String prompt = createPrompt(emailRequest);

        Map <String, Object> requestBody = Map.of(
            "contents", new Object[] {
                Map.of("parts", new Object[] {
                    Map.of("text", prompt)
                })
            }
        );

        String response = webClient.post()
            .uri(geminiApiUrl)
            .header("Content-Type", "application/json")
            .header("x-goog-api-key", geminiApiKey)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .block();
        return extractResponseContent(response);

    }

    private String extractResponseContent(String response){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asString();
        }catch(Exception e){
            e.printStackTrace();
            return "Error processing response" + e.getMessage();
        }
        
    }


    private String createPrompt(EmailRequest emailRequest){
        StringBuilder prompt = new StringBuilder();
        prompt.append("Rédige un mail professionnel pour répondre au mail suivant. N'ajoute pas le ligne ou section objet du mail");
        if( emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Utilise un ton ").append(emailRequest.getTone());
        }
        prompt.append("\n Voici le mail : \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
    
}



