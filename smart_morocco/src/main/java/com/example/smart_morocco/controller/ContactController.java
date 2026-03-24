package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Contact;
import com.example.smart_morocco.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Integer id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createContact(@RequestBody Contact contact) {
        if (contact.getEmail() == null || contact.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email obligatoire");
        }
        if (contact.getMessage() == null || contact.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body("Message obligatoire");
        }
        Contact saved = contactService.saveContact(contact);
        return ResponseEntity.ok(saved);
    }
}
