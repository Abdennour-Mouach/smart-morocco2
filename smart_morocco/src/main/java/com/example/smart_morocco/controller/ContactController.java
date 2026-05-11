package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Contact;
import com.example.smart_morocco.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PatchMapping("/{id}")
    public ResponseEntity<Contact> updateContactFlags(@PathVariable Integer id, @RequestBody Map<String, Boolean> payload) {
        return contactService.getContactById(id)
                .map(contact -> {
                    if (payload.containsKey("lu")) {
                        contact.setLu(payload.get("lu"));
                    }
                    if (payload.containsKey("important")) {
                        contact.setImportant(payload.get("important"));
                    }
                    return ResponseEntity.ok(contactService.saveContact(contact));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyToContact(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        return contactService.getContactById(id)
                .map(contact -> ResponseEntity.ok(Map.of("message", "Reponse enregistree")))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Integer id) {
        if (contactService.getContactById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
