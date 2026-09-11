package com.example.legal_contract_management.service;

import com.example.legal_contract_management.entity.Role;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.repository.RoleRepository;
import com.example.legal_contract_management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // GET ALL USERS
    // =========================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================
    // GET USER BY ID
    // =========================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id)
                );
    }


    // =========================
    // CREATE USER
    // =========================

    public User createUser(
            String name,
            String email,
            String password,
            Long roleId) {

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Find role
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RuntimeException("Role not found")
                );

        // Create user
        User user = new User();

        user.setName(name);
        user.setEmail(email);

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole(role);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }


    // =========================
    // UPDATE USER
    // =========================

    public User updateUser(
            Long id,
            String name,
            String email,
            String password,
            Long roleId) {

        User user = getUserById(id);

        // Check email if changed
        if (!user.getEmail().equals(email)
                && userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Find role
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RuntimeException("Role not found")
                );

        user.setName(name);
        user.setEmail(email);
        user.setRole(role);

        // Update password only if provided
        if (password != null
                && !password.trim().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(password)
            );
        }

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }


    // =========================
    // DELETE USER
    // =========================

    public String deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);

        return "User deleted successfully";
    }


    // =========================
    // GET ALL ROLES
    // =========================

    public List<Role> getAllRoles() {

        return roleRepository.findAll();
    }


    // =========================
    // UPDATE USER ROLE
    // =========================

    public User updateUserRole(
            Long userId,
            Long roleId) {

        User user = getUserById(userId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RuntimeException("Role not found")
                );

        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}