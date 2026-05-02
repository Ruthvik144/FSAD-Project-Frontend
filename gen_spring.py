import os

base_path = "spring-backend/src/main/java/com/wellcampus/api"
os.makedirs(os.path.join(base_path, "model"), exist_ok=True)
os.makedirs(os.path.join(base_path, "repository"), exist_ok=True)
os.makedirs(os.path.join(base_path, "controller"), exist_ok=True)

models = {
    "Video": {"id": "Long", "title": "String", "duration": "String", "thumb": "String", "videoId": "String"},
    "Meal": {"id": "Long", "type": "String", "title": "String", "cal": "Integer", "tags": "List<String>"},
    "Event": {"id": "Long", "title": "String", "category": "String", "startDate": "String", "endDate": "String", "time": "String", "location": "String", "description": "String"},
    "CommunityPost": {"id": "Long", "tag": "String", "text": "String", "likes": "Integer", "comments": "Integer"},
    "Resource": {"id": "Long", "title": "String", "type": "String", "content": "String"},
    "Registration": {"id": "Long", "eventId": "Long", "userEmail": "String", "userName": "String", "timestamp": "String"},
    "UserLog": {"id": "Long", "name": "String", "email": "String", "role": "String", "time": "String", "date": "String", "day": "String"}
}

for name, fields in models.items():
    fields_str = ""
    for f, t in fields.items():
        if f == 'id': continue
        if t == "List<String>":
            fields_str += f"""
    @ElementCollection
    private {t} {f};"""
        elif f in ['content', 'description']:
            fields_str += f"""
    @Column(columnDefinition = "TEXT")
    private {t} {f};"""
        else:
            fields_str += f"\n    private {t} {f};"

    content = f"""package com.wellcampus.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class {name} {{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
{fields_str}
}}
"""
    with open(os.path.join(base_path, "model", f"{name}.java"), "w") as f:
        f.write(content)

    # repository
    content = f"""package com.wellcampus.api.repository;

import com.wellcampus.api.model.{name};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface {name}Repository extends JpaRepository<{name}, Long> {{
}}
"""
    with open(os.path.join(base_path, "repository", f"{name}Repository.java"), "w") as f:
        f.write(content)

# Global controller
controller = """package com.wellcampus.api.controller;

import com.wellcampus.api.model.*;
import com.wellcampus.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class DataController {

    @Autowired private VideoRepository videoRepo;
    @Autowired private MealRepository mealRepo;
    @Autowired private EventRepository eventRepo;
    @Autowired private CommunityPostRepository postRepo;
    @Autowired private ResourceRepository resourceRepo;
    @Autowired private RegistrationRepository regRepo;
    @Autowired private UserLogRepository logRepo;

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
"""
with open(os.path.join(base_path, "controller", "DataController.java"), "w") as f:
    f.write(controller)

# App properties
properties = """spring.datasource.url=jdbc:mysql://${MYSQLHOST:localhost}:${MYSQLPORT:3306}/${MYSQLDATABASE:wellcampus_db}?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=${MYSQLUSER:root}
spring.datasource.password=${MYSQLPASSWORD:root}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
server.port=${PORT:5000}
"""
with open("spring-backend/src/main/resources/application.properties", "w") as f:
    f.write(properties)
print("Finished generation!")
