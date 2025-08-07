package ProjectRuX.PostService.service;

import ProjectRuX.PostService.entity.Applicant;
import ProjectRuX.PostService.entity.RoleRequirement;
import ProjectRuX.PostService.model.PostDto;
import ProjectRuX.PostService.enums.PostStatus;
import ProjectRuX.PostService.enums.Skill;

import java.util.List;
import java.util.Map;

public interface PostService {

    public PostDto createPost(PostDto postDto);

    public PostDto updatePost(String id, PostDto postDto);

    public PostDto getPostById(String id);

    public List<PostDto> getAllPosts();

    public void deletePost(String id);

    public PostDto updateTechStack(String id, List<Skill> newTechStack);

    public PostDto updateRolesRequired(String postId, List<RoleRequirement> newRolesRequired);

    public PostDto addApplicant(String postId, Applicant newApplicant);

    public PostDto removeApplicant(String postId, String userId);

    public Map<String, Applicant> updateApplicantStatus(String postId, String applicantId, Applicant applicantStatus);

    public Map<String, PostStatus> updatePostStatus(String id, PostStatus postStatus);
}
