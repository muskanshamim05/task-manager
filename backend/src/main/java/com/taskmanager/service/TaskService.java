package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskDTO;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks(String filter, String search) {
        boolean hasSearch = search != null && !search.trim().isEmpty();

        if (hasSearch) {
            if ("active".equalsIgnoreCase(filter)) {
                return taskRepository.searchByTitleAndStatus(search.trim(), false);
            } else if ("completed".equalsIgnoreCase(filter)) {
                return taskRepository.searchByTitleAndStatus(search.trim(), true);
            } else {
                return taskRepository.searchByTitle(search.trim());
            }
        }

        if ("active".equalsIgnoreCase(filter)) {
            return taskRepository.findByDoneOrderByCreatedAtDesc(false);
        } else if ("completed".equalsIgnoreCase(filter)) {
            return taskRepository.findByDoneOrderByCreatedAtDesc(true);
        }

        return taskRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(TaskDTO dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setDone(false);
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, TaskDTO dto) {
        return taskRepository.findById(id).map(existing -> {
            existing.setTitle(dto.getTitle());
            existing.setDescription(dto.getDescription());
            existing.setDueDate(dto.getDueDate());
            existing.setDone(dto.isDone());
            return taskRepository.save(existing);
        });
    }

    public Optional<Task> toggleTask(Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setDone(!task.isDone());
            return taskRepository.save(task);
        });
    }

    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long countActive() {
        return taskRepository.findByDoneOrderByCreatedAtDesc(false).size();
    }

    public long countCompleted() {
        return taskRepository.findByDoneOrderByCreatedAtDesc(true).size();
    }
}
