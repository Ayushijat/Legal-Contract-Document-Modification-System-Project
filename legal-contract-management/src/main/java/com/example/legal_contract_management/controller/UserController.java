package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.entity.Role;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // =========================
    // GET ALL ROLES
    // =========================

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {

        return ResponseEntity.ok(
                userService.getAllRoles()
        );
    }


    // =========================
    // GET USER BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    // =========================
    // CREATE USER
    // =========================

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam Long roleId) {

        return ResponseEntity.ok(
                userService.createUser(
                        name,
                        email,
                        password,
                        roleId
                )
        );
    }


    // =========================
    // UPDATE USER
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) String password,
            @RequestParam Long roleId) {

        return ResponseEntity.ok(
                userService.updateUser(
                        id,
                        name,
                        email,
                        password,
                        roleId
                )
        );
    }


    // =========================
    // UPDATE USER ROLE
    // =========================

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestParam Long roleId) {

        return ResponseEntity.ok(
                userService.updateUserRole(
                        id,
                        roleId
                )
        );
    }


    // =========================
    // DELETE USER
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.deleteUser(id)
        );
    }
}