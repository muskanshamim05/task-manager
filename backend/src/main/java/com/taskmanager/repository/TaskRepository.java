package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // All tasks sorted newest first
    List<Task> findAllByOrderByCreatedAtDesc();

    // Filter by done status
    List<Task> findByDoneOrderByCreatedAtDesc(boolean done);

    // Search by title (case-insensitive)
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY t.createdAt DESC")
    List<Task> searchByTitle(@Param("keyword") String keyword);

    // Search + filter by status
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND t.done = :done ORDER BY t.createdAt DESC")
    List<Task> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("done") boolean done);
}
