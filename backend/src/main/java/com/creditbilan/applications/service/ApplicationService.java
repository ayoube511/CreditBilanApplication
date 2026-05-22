package com.creditbilan.applications.service;

import com.creditbilan.applications.dto.ApplicationDtos;
import com.creditbilan.applications.entity.Counterparty;
import com.creditbilan.applications.entity.CreditApplication;
import com.creditbilan.applications.repository.ApplicationRepository;
import com.creditbilan.applications.repository.CounterpartyRepository;
import com.creditbilan.audit.service.AuditService;
import com.creditbilan.common.exception.BusinessException;
import com.creditbilan.common.exception.ResourceNotFoundException;
import com.creditbilan.common.response.PageResponse;
import com.creditbilan.users.entity.User;
import com.creditbilan.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CounterpartyRepository counterpartyRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public PageResponse<ApplicationDtos.ListItem> getApplications(
            String status, String segment, String sector, String q,
            int page, int size, String userEmail) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CreditApplication> result = applicationRepository.findWithFilters(
                status, segment, sector, q, pageable);

        Page<ApplicationDtos.ListItem> mapped = result.map(this::toListItem);
        return PageResponse.from(mapped);
    }

    @Transactional
    public ApplicationDtos.Detail createApplication(ApplicationDtos.CreateRequest request, String userEmail) {
        User user = userRepository.findByEmailAndIsActiveTrue(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", null));

        Counterparty counterparty = new Counterparty();
        counterparty.setLegalName(request.getClientName());
        counterparty.setSegment(request.getSegment());
        counterparty.setSector(request.getSector());
        counterparty.setOrganization(user.getOrganization());
        counterparty = counterpartyRepository.save(counterparty);

        CreditApplication app = new CreditApplication();
        app.setReference(generateReference());
        app.setCounterparty(counterparty);
        app.setCreatedBy(user);
        app.setOrganization(user.getOrganization());
        app.setStatus("DRAFT");
        app.setSegment(request.getSegment());
        app.setSector(request.getSector());
        app.setFinancingType(request.getFinancingType());
        app.setAmountRequestedMad(request.getAmountRequestedMad());
        app.setApplicationDate(request.getApplicationDate() != null ?
                request.getApplicationDate() : LocalDate.now());

        app = applicationRepository.save(app);
        auditService.log("CREATE_APPLICATION", "CreditApplication", app.getId(), null, null);

        return toDetail(applicationRepository.findByIdWithDetails(app.getId()).orElseThrow());
    }

    public ApplicationDtos.Detail getApplication(Long id) {
        CreditApplication app = applicationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier", id));
        return toDetail(app);
    }

    @Transactional
    public ApplicationDtos.Detail updateApplication(Long id, ApplicationDtos.UpdateRequest request, String userEmail) {
        CreditApplication app = applicationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier", id));

        if (request.getSegment() != null) app.setSegment(request.getSegment());
        if (request.getSector() != null) app.setSector(request.getSector());
        if (request.getFinancingType() != null) app.setFinancingType(request.getFinancingType());
        if (request.getAmountRequestedMad() != null) app.setAmountRequestedMad(request.getAmountRequestedMad());

        app = applicationRepository.save(app);
        auditService.log("UPDATE_APPLICATION", "CreditApplication", app.getId(), null, null);
        return toDetail(app);
    }

    @Transactional
    public ApplicationDtos.Detail makeDecision(Long id, ApplicationDtos.DecisionRequest request, String userEmail) {
        CreditApplication app = applicationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier", id));

        if (!app.getStatus().equals("SCORING_DONE")) {
            throw new BusinessException("Le scoring doit être effectué avant la décision");
        }

        User user = userRepository.findByEmailAndIsActiveTrue(userEmail).orElseThrow();
        app.setDecision(request.getDecision());
        app.setDecisionReason(request.getReason());
        app.setDecisionDate(LocalDateTime.now());
        app.setDecidedBy(user);
        app.setStatus(request.getDecision().equals("APPROVED") ? "APPROVED" : "REJECTED");

        app = applicationRepository.save(app);
        auditService.log("DECISION_" + request.getDecision(), "CreditApplication", app.getId(), null, null);
        return toDetail(app);
    }

    private String generateReference() {
        String year = String.valueOf(LocalDate.now().getYear());
        String uid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "DOS-" + year + "-" + uid;
    }

    private ApplicationDtos.ListItem toListItem(CreditApplication app) {
        ApplicationDtos.ListItem item = new ApplicationDtos.ListItem();
        item.setId(app.getId());
        item.setReference(app.getReference());
        item.setStatus(app.getStatus());
        item.setSegment(app.getSegment());
        item.setSector(app.getSector());
        item.setAmountRequestedMad(app.getAmountRequestedMad());
        item.setScore(app.getScore());
        item.setCreditClass(app.getCreditClass());
        item.setCreatedAt(app.getCreatedAt());
        if (app.getCounterparty() != null) {
            item.setClientName(app.getCounterparty().getLegalName());
        }
        return item;
    }

    private ApplicationDtos.Detail toDetail(CreditApplication app) {
        ApplicationDtos.Detail detail = new ApplicationDtos.Detail();
        detail.setId(app.getId());
        detail.setReference(app.getReference());
        detail.setStatus(app.getStatus());
        detail.setFinancingType(app.getFinancingType());
        detail.setSegment(app.getSegment());
        detail.setSector(app.getSector());
        detail.setAmountRequestedMad(app.getAmountRequestedMad());
        detail.setScore(app.getScore());
        detail.setCreditClass(app.getCreditClass());
        detail.setDefaultProbabilityPct(app.getDefaultProbabilityPct());
        detail.setDecision(app.getDecision());
        detail.setDecisionReason(app.getDecisionReason());
        detail.setDecisionDate(app.getDecisionDate());
        detail.setApplicationDate(app.getApplicationDate());
        detail.setCreatedAt(app.getCreatedAt());
        detail.setUpdatedAt(app.getUpdatedAt());

        if (app.getCounterparty() != null) {
            ApplicationDtos.CounterpartyDto cp = new ApplicationDtos.CounterpartyDto();
            cp.setId(app.getCounterparty().getId());
            cp.setLegalName(app.getCounterparty().getLegalName());
            cp.setSegment(app.getCounterparty().getSegment());
            cp.setSector(app.getCounterparty().getSector());
            detail.setCounterparty(cp);
        }

        if (app.getCreatedBy() != null) {
            ApplicationDtos.UserDto u = new ApplicationDtos.UserDto();
            u.setId(app.getCreatedBy().getId());
            u.setFullName(app.getCreatedBy().getFullName());
            u.setEmail(app.getCreatedBy().getEmail());
            detail.setCreatedBy(u);
        }

        return detail;
    }
}
