package com.wellcampus.api.controller;

import com.wellcampus.api.model.*;
import com.wellcampus.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class DataController {

    @Autowired private VideoRepository videoRepo;
    @Autowired private MealRepository mealRepo;
    @Autowired private EventRepository eventRepo;
    @Autowired private CommunityPostRepository postRepo;
    @Autowired private ResourceRepository resourceRepo;
    @Autowired private RegistrationRepository regRepo;
    @Autowired private UserLogRepository logRepo;
    @Autowired private UserRepository userRepo;

    @GetMapping("/data")
    public Map<String, Object> getAllData() {
        Map<String, Object> map = new HashMap<>();
        map.put("videos", videoRepo.findAll());
        map.put("meals", mealRepo.findAll());
        map.put("events", eventRepo.findAll());
        map.put("posts", postRepo.findAll());
        map.put("resources", resourceRepo.findAll());
        map.put("registrations", regRepo.findAll());
        map.put("userLogs", logRepo.findAll());
        return map;
    }

    @PostMapping("/auth/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            response.put("error", "Email already exists");
            return response;
        }
        User savedUser = userRepo.save(user);
        response.put("success", true);
        response.put("user", savedUser);
        return response;
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            response.put("success", true);
            response.put("user", userOpt.get());
        } else {
            response.put("error", "Invalid email or password");
        }
        return response;
    }

    @PutMapping("/videos")
    public List<Video> updateVideos(@RequestBody List<Video> items) {
        videoRepo.deleteAll();
        return videoRepo.saveAll(items);
    }

    @PutMapping("/meals")
    public List<Meal> updateMeals(@RequestBody List<Meal> items) {
        mealRepo.deleteAll();
        return mealRepo.saveAll(items);
    }

    @PutMapping("/events")
    public List<Event> updateEvents(@RequestBody List<Event> items) {
        eventRepo.deleteAll();
        return eventRepo.saveAll(items);
    }

    @PutMapping("/posts")
    public List<CommunityPost> updatePosts(@RequestBody List<CommunityPost> items) {
        postRepo.deleteAll();
        return postRepo.saveAll(items);
    }

    @PutMapping("/resources")
    public List<Resource> updateResources(@RequestBody List<Resource> items) {
        resourceRepo.deleteAll();
        return resourceRepo.saveAll(items);
    }

    @PutMapping("/registrations")
    public List<Registration> updateRegistrations(@RequestBody List<Registration> items) {
        regRepo.deleteAll();
        return regRepo.saveAll(items);
    }

    @PutMapping("/userLogs")
    public List<UserLog> updateUserLogs(@RequestBody List<UserLog> items) {
        logRepo.deleteAll();
        return logRepo.saveAll(items);
    }
}
