package com.projectrux.service.impl;


import com.fasterxml.jackson.core.type.TypeReference;
import com.projectrux.entity.Applicant;
import com.projectrux.entity.Post;
import com.projectrux.entity.RoleRequirement;
import com.projectrux.enums.ApplicantStatus;
import com.projectrux.enums.PostStatus;
import com.projectrux.enums.Roles;
import com.projectrux.enums.Skill;
import com.projectrux.exception.ResourceAlreadyExists;
import com.projectrux.exception.ResourceNotFoundException;
import com.projectrux.model.ApplicantStatusUpdateRequest;
import com.projectrux.model.MailDto;
import com.projectrux.model.PostDto;
import com.projectrux.repository.PostRepository;
import com.projectrux.service.MailService;
import com.projectrux.service.PostService;
import com.projectrux.service.RedisService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RedisService redisService;

    @Autowired
    MailService mailService;

    @Override
    public PostDto createPost(PostDto postDto) {
        Post post = mapper.map(postDto, Post.class);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setStatus(PostStatus.OPEN);
        Post save = postRepository.save(post);
        return mapper.map(save, PostDto.class);
    }

    @Override
    public PostDto updatePost(String id, PostDto postDto) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post Does not exist with id : " + id));

        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setTechStack(postDto.getTechStack());
        post.setRolesRequired(postDto.getRolesRequired());
        post.setTags(postDto.getTags());
        post.setStatus(postDto.getStatus());
        post.setUpdatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(post);
        return mapper.map(savedPost, PostDto.class);
    }

    @Override
    public PostDto getPostById(String id) {
        PostDto cachedPostDto = redisService.get(id, PostDto.class, 900L);
        if(cachedPostDto != null){
            return cachedPostDto;
        }

        Post post = postRepository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Post Does not exist with id : " + id));
        PostDto postDto = mapper.map(post, PostDto.class);
        redisService.set(id, postDto, 900L);

        return postDto;
    }

    @Override
    public List<PostDto> getUserPostById(String id) {
//        List<PostDto> cachedPostsDto = redisService.get("getUserPostById/" + id, new TypeReference<List<PostDto>>() {}, 900L);
//        if (cachedPostsDto != null) {
//            return cachedPostsDto;
//        }

        List<Post> allUserPost = postRepository.findByCreatedBy(id);
//                orElseThrow(() -> new ResourceNotFoundException("Post Does not exist with id : " + id));
        List<PostDto> allUserPostDto = allUserPost.stream()
                .map(post -> mapper.map(post, PostDto.class))
                .toList();

//        redisService.set("getUserPostById/" + id, allUserPostDto, 900L);
        return allUserPostDto;
    }

    @Override
    public List<PostDto> getPostsByApplicantUserId(String userId) {
        List<Post> allByApplicantUserId = postRepository.findAllByApplicantUserId(userId);
        return allByApplicantUserId.stream().map(post -> mapper.map(post, PostDto.class)).toList();
    }

    @Override
    public List<PostDto> getAllPosts() {
//        List<PostDto> cachedPosts = redisService.get("getAllPosts", new TypeReference<List<PostDto>>() {}, 900L);
//        if (cachedPosts != null) {
//            return cachedPosts;
//        }

        List<Post> allPosts = postRepository.findAll();
        List<PostDto> postDtos = allPosts.stream()
                .map(post -> mapper.map(post, PostDto.class))
                .collect(Collectors.toList());

//        redisService.set("getAllPosts", postDtos, 900L);
        return postDtos;
    }

    @Override
    public void deletePost(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post Does not exist with id : " + id));
        postRepository.deleteById(id);

        String userId = post.getCreatedBy();
        String cacheKey = "getUserPostById/" + userId;
        redisService.delete(cacheKey);
    }

    @Override
    public List<Skill> getAllSkills() {
        return List.of(Skill.values());
    }

    @Override
    public List<Roles> getAllRoles() {
        return List.of(Roles.values());
    }

    @Override
    public PostDto updateTechStack(String id, List<Skill> newTechStack) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        post.setTechStack(newTechStack);
        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost = postRepository.save(post);
        return mapper.map(updatedPost, PostDto.class);
    }

    @Override
    public PostDto updateRolesRequired(String id, List<RoleRequirement> newRolesRequired) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        post.setRolesRequired(newRolesRequired);
        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost = postRepository.save(post);
        return mapper.map(updatedPost, PostDto.class);
    }

    @Override
    public PostDto addApplicant(String postId, Applicant newApplicant) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        List<Applicant> applicants = post.getApplicants();
        boolean alreadyApplied = false;

        if(applicants != null) {
            alreadyApplied = applicants.stream().anyMatch(applicant -> applicant.getUserId().equals(newApplicant.getUserId()));
        }
        if (alreadyApplied) {
            throw new ResourceAlreadyExists("User has already applied to this post.");
        }

        newApplicant.setStatus(ApplicantStatus.PENDING);
        if(applicants == null){
            applicants = new ArrayList<>();
            applicants.add(newApplicant);
            post.setApplicants(applicants);
        }
        else{
            post.getApplicants().add(newApplicant);
        }
        post.setApplied(post.getApplied() + 1);
        post.setUpdatedAt(LocalDateTime.now());
        Post updatedPost = postRepository.save(post);

        return mapper.map(updatedPost, PostDto.class);
    }

    @Override
    public PostDto removeApplicant(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        boolean removed = post.getApplicants().removeIf(applicant ->
                applicant.getUserId().equals(userId));

        if (!removed) {
            throw new ResourceAlreadyExists("Applicant not found for user ID: " + userId);
        }

        post.setUpdatedAt(LocalDateTime.now());
        Post updatedPost = postRepository.save(post);

        return mapper.map(updatedPost, PostDto.class);
    }

    @Override
    public Map<String, Applicant> updateApplicantStatus(String postId, String applicantId, ApplicantStatusUpdateRequest applicantStatus) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        boolean updated = false;
        for (Applicant applicant : post.getApplicants()) {
            if (applicant.getUserId().equals(applicantId)) {
                mailService.sendMail(applicantStatus.getMailDto().getReceiverMail(), applicantStatus.getMailDto().getSubject(), applicantStatus.getMailDto().getBody());
                applicant.setStatus(applicantStatus.getApplicantStatus().getStatus());
                updated = true;
                break;
            }
        }

        if (!updated) {
            throw new RuntimeException("Applicant not found in post");
        }
        Post saved = postRepository.save(post);
        return Map.of("Post Updated Successfully", applicantStatus.getApplicantStatus());
    }

    @Override
    public Map<String, PostStatus> updatePostStatus(String id, PostStatus postStatus) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setStatus(postStatus);

        Post saved = postRepository.save(post);
        return Map.of("Status updated successfully", postStatus);
    }
}
