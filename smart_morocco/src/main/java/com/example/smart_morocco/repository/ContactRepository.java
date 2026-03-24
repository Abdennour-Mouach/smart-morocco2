package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Integer> {
}
