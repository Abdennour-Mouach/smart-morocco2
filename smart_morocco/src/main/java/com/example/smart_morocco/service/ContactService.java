package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Contact;
import com.example.smart_morocco.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(Integer id) {
        return contactRepository.findById(id);
    }

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }
}
