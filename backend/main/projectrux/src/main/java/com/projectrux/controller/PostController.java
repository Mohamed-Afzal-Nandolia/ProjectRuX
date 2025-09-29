package com.projectrux.controller;


import com.projectrux.entity.Applicant;
import com.projectrux.entity.RoleRequirement;
import com.projectrux.enums.PostStatus;
import com.projectrux.enums.Roles;
import com.projectrux.enums.Skill;
import com.projectrux.model.ApplicantStatusUpdateRequest;
import com.projectrux.model.MailDto;
import com.projectrux.model.PostDto;
import com.projectrux.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/create-post")
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto){
        PostDto createdPost = postService.createPost(postDto);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @PutMapping("/update-post/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable String id, @RequestBody PostDto postDto){
        PostDto updatedPost = postService.updatePost(id, postDto);
        return ResponseEntity.ok(updatedPost);
    }

    @GetMapping("/post/get-post/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable String id){
        PostDto post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // Get All Post Of That User
    @GetMapping("/get-user-post/{id}")
    public ResponseEntity<List<PostDto>> getUserPostById(@PathVariable String id){
        List<PostDto> post = postService.getUserPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/applied/{userId}")
    public ResponseEntity<List<PostDto>> getAppliedPosts(@PathVariable String userId) {
        List<PostDto> postDto = postService.getPostsByApplicantUserId(userId);
        return ResponseEntity.ok(postDto);
    }

    @GetMapping("/get-all-post")
    public ResponseEntity<List<PostDto>> getAllPost(@RequestParam(required = false) Roles role,
                                                    @RequestParam(required = false) Skill skill){
        List<PostDto> allPosts = postService.getAllPosts(role, skill);
        return ResponseEntity.ok(allPosts);
    }

    @DeleteMapping("/delete-post/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id){
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted Successfully");
    }

    @GetMapping("/get-all-skills")
    public ResponseEntity<List<Skill>> getAllSkills(){
        List<Skill> allSkills = postService.getAllSkills();
        return ResponseEntity.ok(allSkills);
    }

    @PutMapping("/update-techstack/{id}")
    public ResponseEntity<PostDto> updateTechStack(@PathVariable String id, @RequestBody List<Skill> techStack) {
        PostDto updatedPost = postService.updateTechStack(id, techStack);
        return ResponseEntity.ok(updatedPost);
    }

    @GetMapping("/get-all-roles")
    public ResponseEntity<List<Roles>> getAllRoles(){
        List<Roles> allRoles = postService.getAllRoles();
        return ResponseEntity.ok(allRoles);
    }

    @PutMapping("/roles-required/{id}")
    public ResponseEntity<PostDto> updateRolesRequired(@PathVariable String id, @RequestBody List<RoleRequirement> rolesRequired) {
        PostDto updatedPost = postService.updateRolesRequired(id, rolesRequired);
        return ResponseEntity.ok(updatedPost);
    }

    @PostMapping("/add-applicants/{id}")
    public ResponseEntity<PostDto> addApplicant(@PathVariable String id, @RequestBody Applicant applicant) {
        PostDto updatedPost = postService.addApplicant(id, applicant);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}/remove-applicants/{userId}")
    public ResponseEntity<String> removeApplicant(@PathVariable String postId, @PathVariable String userId) {
        PostDto updatedPost = postService.removeApplicant(postId, userId);
        return ResponseEntity.ok("Applicant removed Successfully");
    }

    @PatchMapping("/{postId}/applicant/update-status/{applicantId}")
    public ResponseEntity<Map<String, Applicant>> updateApplicantStatus(
            @PathVariable String postId,
            @PathVariable String applicantId,
            @RequestBody ApplicantStatusUpdateRequest applicantStatus){
        Map<String, Applicant> updatedApplicantStatus = postService.updateApplicantStatus(postId, applicantId, applicantStatus);

        return ResponseEntity.ok(updatedApplicantStatus);
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<Map<String, PostStatus>> updatePostStatus(@PathVariable String id, @RequestBody PostStatus postStatus){
        Map<String, PostStatus> updatedPostStatus = postService.updatePostStatus(id, postStatus);

        return ResponseEntity.ok(updatedPostStatus);
    }
}
