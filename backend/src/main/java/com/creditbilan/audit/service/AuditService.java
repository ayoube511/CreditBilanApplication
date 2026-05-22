package com.creditbilan.audit.service;

import com.creditbilan.audit.entity.AuditEvent;
import com.creditbilan.audit.repository.AuditRepository;
import com.creditbilan.common.response.PageResponse;
import com.creditbilan.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditRepository auditRepository;
    private final UserRepository userRepository;

    public void log(String action, String entityType, Long entityId, String payload, String ipAddress) {
        try {
            AuditEvent event = new AuditEvent();
            event.setAction(action);
            event.setEntityType(entityType);
            event.setEntityId(entityId);
            event.setPayloadJson(payload);
            event.setIpAddress(ipAddress);

            // Get current user if available
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                userRepository.findByEmailAndIsActiveTrue(auth.getName()).ifPresent(user -> {
                    event.setUserId(user.getId());
                    if (user.getOrganization() != null) {
                        event.setOrganizationId(user.getOrganization().getId());
                    }
                });
            }

            auditRepository.save(event);
        } catch (Exception e) {
            log.error("Erreur lors de l'audit: {}", e.getMessage());
        }
    }

    public PageResponse<AuditEvent> getEvents(String action, String entityType, int page, int size) {
        var result = auditRepository.findWithFilters(action, entityType, PageRequest.of(page, size));
        return PageResponse.from(result);
    }
}
