package com.unimanagement.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.unimanagement.ai.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
}
