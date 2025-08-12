package ProjectRuX.PostService.service.impl;

import ProjectRuX.PostService.entity.Applicant;
import ProjectRuX.PostService.entity.Post;
import ProjectRuX.PostService.entity.RoleRequirement;
import ProjectRuX.PostService.exception.ResourceAlreadyExists;
import ProjectRuX.PostService.exception.ResourceNotFoundException;
import ProjectRuX.PostService.model.PostDto;
import ProjectRuX.PostService.repository.PostRepository;
import ProjectRuX.PostService.service.PostService;
import ProjectRuX.PostService.enums.ApplicantStatus;
import ProjectRuX.PostService.enums.PostStatus;
import ProjectRuX.PostService.enums.Skill;
import ProjectRuX.PostService.service.RedisService;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Override
    public PostDto createPost(PostDto postDto) {
        Post post = mapper.map(postDto, Post.class);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
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
        PostDto cachedPostDto = redisService.get(id, PostDto.class, 60L);
        if(cachedPostDto != null){
            return cachedPostDto;
        }

        Post post = postRepository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Post Does not exist with id : " + id));
        PostDto postDto = mapper.map(post, PostDto.class);
        redisService.set(id, postDto, 60L);

        return postDto;
    }

    @Override
    public List<PostDto> getAllPosts() {
        List<PostDto> cachedPosts = redisService.get("getAllPosts", new TypeReference<List<PostDto>>() {}, 60L);
        if (cachedPosts != null) {
            return cachedPosts;
        }

        List<Post> allPosts = postRepository.findAll();
        List<PostDto> postDtos = allPosts.stream()
                .map(post -> mapper.map(post, PostDto.class))
                .collect(Collectors.toList());

        redisService.set("getAllPosts", postDtos, 60L);
        return postDtos;
    }

    @Override
    public void deletePost(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post Does not exist with id : " + id));
        postRepository.deleteById(id);
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

        boolean alreadyApplied = post.getApplicants().stream()
                .anyMatch(applicant -> applicant.getUserId().equals(newApplicant.getUserId()));

        if (alreadyApplied) {
            throw new ResourceAlreadyExists("User has already applied to this post.");
        }

        newApplicant.setStatus(ApplicantStatus.PENDING);

        post.getApplicants().add(newApplicant);
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
    public Map<String, Applicant> updateApplicantStatus(String postId, String applicantId, Applicant applicantStatus) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        boolean updated = false;
        for (Applicant applicant : post.getApplicants()) {
            if (applicant.getUserId().equals(applicantId)) {
                applicant.setStatus(applicantStatus.getStatus());
                updated = true;
                break;
            }
        }

        if (!updated) {
            throw new RuntimeException("Applicant not found in post");
        }
        Post saved = postRepository.save(post);
        return Map.of("Post Updated Successfully", applicantStatus);
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
