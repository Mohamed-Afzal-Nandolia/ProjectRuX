package ProjectRuX.PostService.controller;

import ProjectRuX.PostService.entity.Applicant;
import ProjectRuX.PostService.entity.RoleRequirement;
import ProjectRuX.PostService.model.PostDto;
import ProjectRuX.PostService.service.PostService;
import ProjectRuX.PostService.enums.PostStatus;
import ProjectRuX.PostService.enums.Skill;
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

    @GetMapping("/get-post/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable String id){
        PostDto post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/get-all-post")
    public ResponseEntity<List<PostDto>> getAllPost(){
        List<PostDto> allPosts = postService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }

    @DeleteMapping("/delete-post/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id){
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted Successfully");
    }

    @PutMapping("/update-techstack/{id}")
    public ResponseEntity<PostDto> updateTechStack(@PathVariable String id, @RequestBody List<Skill> techStack) {
        PostDto updatedPost = postService.updateTechStack(id, techStack);
        return ResponseEntity.ok(updatedPost);
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
            @RequestBody Applicant applicantStatus){
        Map<String, Applicant> updatedApplicantStatus = postService.updateApplicantStatus(postId, applicantId, applicantStatus);

        return ResponseEntity.ok(updatedApplicantStatus);
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<Map<String, PostStatus>> updatePostStatus(@PathVariable String id, @RequestBody PostStatus postStatus){
        Map<String, PostStatus> updatedPostStatus = postService.updatePostStatus(id, postStatus);

        return ResponseEntity.ok(updatedPostStatus);
    }
}
