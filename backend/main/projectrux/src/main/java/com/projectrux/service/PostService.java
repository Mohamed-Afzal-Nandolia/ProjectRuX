package com.projectrux.service;

import com.projectrux.entity.Applicant;
import com.projectrux.entity.RoleRequirement;
import com.projectrux.enums.PostStatus;
import com.projectrux.enums.Roles;
import com.projectrux.enums.Skill;
import com.projectrux.model.ApplicantStatusUpdateRequest;
import com.projectrux.model.MailDto;
import com.projectrux.model.PostDto;

import java.util.List;
import java.util.Map;

public interface PostService {

    public PostDto createPost(PostDto postDto);

    public PostDto updatePost(String id, PostDto postDto);

    public PostDto getPostById(String id);

    public List<PostDto> getUserPostById(String id);

    public List<PostDto> getPostsByApplicantUserId(String userId);

    public List<PostDto> getAllPosts();

    public void deletePost(String id);

    public List<Skill> getAllSkills();

    public List<Roles> getAllRoles();

    public PostDto updateTechStack(String id, List<Skill> newTechStack);

    public PostDto updateRolesRequired(String postId, List<RoleRequirement> newRolesRequired);

    public PostDto addApplicant(String postId, Applicant newApplicant);

    public PostDto removeApplicant(String postId, String userId);

    public Map<String, Applicant> updateApplicantStatus(String postId, String applicantId, ApplicantStatusUpdateRequest applicantStatus);

    public Map<String, PostStatus> updatePostStatus(String id, PostStatus postStatus);
}
