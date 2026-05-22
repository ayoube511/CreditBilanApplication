package com.creditbilan.applications.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApplicationDtos {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Nom du client obligatoire")
        private String clientName;
        private String segment;
        private String sector;
        private String financingType;
        @Positive(message = "Montant doit être positif")
        private BigDecimal amountRequestedMad;
        private LocalDate applicationDate;
    }

    @Data
    public static class UpdateRequest {
        private String segment;
        private String sector;
        private String financingType;
        private BigDecimal amountRequestedMad;
        private String status;
    }

    @Data
    public static class DecisionRequest {
        @NotBlank
        private String decision;
        private String reason;
    }

    @Data
    public static class ListItem {
        private Long id;
        private String reference;
        private String clientName;
        private String status;
        private String segment;
        private String sector;
        private BigDecimal amountRequestedMad;
        private Integer score;
        private String creditClass;
        private LocalDateTime createdAt;
    }

    @Data
    public static class Detail {
        private Long id;
        private String reference;
        private String status;
        private String financingType;
        private String segment;
        private String sector;
        private BigDecimal amountRequestedMad;
        private Integer score;
        private String creditClass;
        private BigDecimal defaultProbabilityPct;
        private String decision;
        private String decisionReason;
        private LocalDateTime decisionDate;
        private LocalDate applicationDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private CounterpartyDto counterparty;
        private UserDto createdBy;
    }

    @Data
    public static class CounterpartyDto {
        private Long id;
        private String legalName;
        private String segment;
        private String sector;
    }

    @Data
    public static class UserDto {
        private Long id;
        private String fullName;
        private String email;
    }
}
