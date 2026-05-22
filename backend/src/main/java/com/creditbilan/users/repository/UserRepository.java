package com.creditbilan.users.repository;

import com.creditbilan.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndIsActiveTrue(String email);
    boolean existsByEmail(String email);
}
