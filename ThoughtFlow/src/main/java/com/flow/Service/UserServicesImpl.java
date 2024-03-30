package com.flow.Service;

//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.flow.Entity.Comment;
import com.flow.Entity.Post;
import com.flow.Entity.PostCategory;
import com.flow.Entity.PostLike;
import com.flow.Entity.UserProfile;
import com.flow.Exceptions.NotFoundException;
import com.flow.Exceptions.SomethingWentWrong;
import com.flow.Repository.NotificationRepository;
import com.flow.Repository.PostRepository;
import com.flow.Repository.UserProfileRepo;
import com.flow.Repository.UserRepository;

@Service
public class UserServicesImpl implements UserService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private UserProfileRepo userProfileRepo;

	@Autowired
	private PostRepository postRepo;
	
	@Autowired
	private NotificationRepository notiRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public UserProfile createUser(UserProfile user) throws SomethingWentWrong {
		// TODO Auto-generated method stub
		Optional<UserProfile> u = userProfileRepo.findById(user.getId());
		if (u.isPresent()) {
			throw new SomethingWentWrong("User already exist!");
		}
		userProfileRepo.save(user);
		return user;
	}

	@Override
	public UserProfile deleteUser(long id) throws NotFoundException {
		// TODO Auto-generated method stub
		Optional<UserProfile> u = userProfileRepo.findById(id);
		
		if (u.isEmpty()) {
			throw new NotFoundException("User not found!");
		}
		
		UserProfile up = u.get();

		// Delete the related records in user_profile_following
		userProfileRepo.deleteFollowingRelationships(up.getId());
		userProfileRepo.deleteFollowerRelationships(up.getId());
		
		List<Post> userPosts = up.getPost();
		for(Post p: userPosts) {
			removePost(p.getPost_id(),id);
		}
		
		// deleting the post of user
		up.getPost().clear();

		// Delete the related records in user_profile_following
		up.getFollowers().clear();
		up.getFollowing().clear();

		up.setFollowers(null);
		up.setFollowing(null);
        //userProfileRepo.save(up);
		
		//delete user notification also
		notiRepo.deleteNotificationsByRecipientId(up.getId());
		notiRepo.deleteNotificationsBySenderId(up.getId());

		// deleting the user
		userProfileRepo.delete(up);
		return up;
	}

	@Override
	public UserProfile addToFollowing(long userID, long F_Id) {
		// TODO Auto-generated method stub
		// get the user
		Optional<UserProfile> upOpt = userProfileRepo.findById(userID);
		UserProfile user = upOpt.get();

		// get following
		Set<UserProfile> following = user.getFollowing();

		// get the user that the you want to follow
		Optional<UserProfile> upFOpt = userProfileRepo.findById(F_Id);
		UserProfile upF = upFOpt.get();

		// add to following list of user
		following.add(upF);
		user.setFollowing(following);

		// add to follower list of the opposite user also
		Set<UserProfile> followerUpf = upF.getFollowers();
		followerUpf.add(user);
		upF.setFollowers(followerUpf);

		// now save both of them
		userProfileRepo.save(user);
		userProfileRepo.save(upF);

		return user;
	}

	@Override
	public void removeFollowing(long userID, long F_Id) {
		// TODO Auto-generated method stub
		// get the user
		Optional<UserProfile> upOpt = userProfileRepo.findById(userID);
		UserProfile user = upOpt.get();

		// get following
		Set<UserProfile> following = user.getFollowing();

		// get the user that the you want to remove from list
		Optional<UserProfile> upFOpt = userProfileRepo.findById(F_Id);
		UserProfile upF = upFOpt.get();

		// remove from following list of user
		following.remove(upF);
		user.setFollowing(following);

		// remove from follower list of the opposite user also
		Set<UserProfile> followerUpf = upF.getFollowers();
		followerUpf.remove(user);
		upF.setFollowers(followerUpf);

		// now save both of them
		userProfileRepo.save(user);
		userProfileRepo.save(upF);
	}

	@Override
	public Post addPost(Post post, long user_id) {
		// TODO Auto-generated method stub
		Optional<UserProfile> upOpt = userProfileRepo.findById(user_id);
		UserProfile user = upOpt.get();

		post.setUser(user);
		post.setDate(LocalDateTime.now());
		Post p = postRepo.save(post);
		return p;
	}

	@Override
	public void removePost(long id, long user_id) {
		// TODO Auto-generated method stub
		Optional<Post> post = postRepo.findById(id);
		Post p = post.get();
		notiRepo.deleteNotificationsByPostId(p.getPost_id());
		postRepo.delete(p);
	}

	@Override
	public Set<UserProfile> getUserFollowing(long id) {
		// TODO Auto-generated method stub
		Optional<UserProfile> optionalUser = userProfileRepo.findById(id);
		UserProfile user = optionalUser.get();
		Set<UserProfile> following = user.getFollowing();
		return following;
	}

	@Override
	public Set<UserProfile> getUserFollowers(long id) {
		// TODO Auto-generated method stub
		Optional<UserProfile> optionalUser = userProfileRepo.findById(id);
		UserProfile user = optionalUser.get();
		Set<UserProfile> followers = user.getFollowers();
		return followers;
	}

	// Code for user feed
	@Override
	public Set<Post> userFeed(long id) throws NotFoundException {
	    // Retrieve the user's profile
	    Optional<UserProfile> optionalUser = userProfileRepo.findById(id);
	    UserProfile user = optionalUser.orElseThrow(() -> new NotFoundException("User not found!"));

	    // Initialize the user's feed
	    List<PostWithPreference> feed = new ArrayList<>();

	    // Iterate through all posts
	    for (Post post : postRepo.findAll()) {
	        PostCategory postCategory = post.getCategory();

	        // Check if the post category is in the user's preferred categories
	        if (user.getFeedCategory().containsKey(postCategory)) {
	            // Get the user's preference score for the category
	            Integer preferenceScore = user.getFeedCategory().get(postCategory);

	            // Add the post along with its preference score
	            feed.add(new PostWithPreference(post, preferenceScore));
	        }
	    }

	    // Sort the feed based on the user's category preferences
	    Collections.sort(feed, (p1, p2) -> p2.getPreferenceScore().compareTo(p1.getPreferenceScore()));

	    // Extract the sorted posts without preference scores
	    Set<Post> sortedFeed = feed.stream().map(PostWithPreference::getPost).collect(Collectors.toCollection(LinkedHashSet::new));

	    // if size of user feed is less than 50 posts then user will get more 50 post
	    // according to his choice of category
	    Set<UserProfile> following = user.getFollowing();

	    for (UserProfile f_user : following) {
	        List<Post> posts = f_user.getPost();
	        for (Post p : posts) {
	            sortedFeed.add(p);
	        }
	    }

	    // Reverse the order of the sortedFeed set
	    List<Post> reversedList = new ArrayList<>(sortedFeed);
	    Collections.reverse(reversedList);
	    sortedFeed = new LinkedHashSet<>(reversedList);

	    // if nothing went right then this will work as backup, 100 random post will be
	    // shown
//	    if (sortedFeed.size() == 0) {
//	        for (Post p : postRepo.findAll()) {
//	            sortedFeed.add(p);
//	            if (sortedFeed.size() == 100) {
//	                break;
//	            }
//	        }
//	    }
	    return sortedFeed;
	}

	// Helper class to store a post with its preference score
	private static class PostWithPreference {
		private Post post;
		private Integer preferenceScore;

		public PostWithPreference(Post post, Integer preferenceScore) {
			this.post = post;
			this.preferenceScore = preferenceScore;
		}

		public Post getPost() {
			return post;
		}

		public Integer getPreferenceScore() {
			return preferenceScore;
		}
	}
	// User feed code ends here

	@Override
	public void userPostLike(long post_id, long user_id) {
		// TODO Auto-generated method stub
		Optional<Post> postOpt = postRepo.findById(post_id);
		Post post = postOpt.get();

		Optional<UserProfile> userOpt = userProfileRepo.findById(user_id);
		UserProfile user = userOpt.get();

		PostLike pl = new PostLike();
		pl.setUser(user_id);
		pl.setStatus("liked");

		List<PostLike> likes = post.getPostLikes();
		likes.add(pl);

		post.setPostLikes(likes);
		postRepo.save(post);
	}

	@Override
	public void userPostComment(long post_id, long user_id, String comment) {
		// TODO Auto-generated method stub
		Optional<Post> postOpt = postRepo.findById(post_id);
		Post post = postOpt.get();

		Optional<UserProfile> userOpt = userProfileRepo.findById(user_id);
		UserProfile user = userOpt.get();

		Comment com = new Comment();
		com.setComment(comment);
		com.setUser(user_id);

		List<Comment> allComments = post.getComments();
		allComments.add(com);

		post.setComments(allComments);
		postRepo.save(post);
	}

	// Delete a comment
	@Override
	public void userDeleteComment(Comment comment, long post_id) {
		// TODO Auto-generated method stub
		Optional<Post> postOpt = postRepo.findById(post_id);
		Post post = postOpt.get();

		List<Comment> comments = post.getComments();
		comments.remove(comment);

		post.setComments(comments);
		postRepo.save(post);
	}

	@Override
	public void userCommentLike(long post_id, Comment comment) {
		// TODO Auto-generated method stub
		Optional<Post> postOpt = postRepo.findById(post_id);
		Post post = postOpt.get();

		List<Comment> comments = post.getComments();
		for (Comment com : comments) {
			if (com.equals(comment)) {
				com.setCommentLike(com.getCommentLike() + 1);
				break;
			}
		}
		post.setComments(comments);
		postRepo.save(post);
	}

	@Override
	public void postUnlike(long post_id, long user_id) {
		// TODO Auto-generated method stub
		Optional<Post> postOpt = postRepo.findById(post_id);
		Post post = postOpt.get();

		Optional<UserProfile> userOpt = userProfileRepo.findById(user_id);
		UserProfile user = userOpt.get();

		List<PostLike> postLikes = post.getPostLikes();
		for (PostLike likes : postLikes) {
			if (likes.getUser() == user_id) {
				postLikes.remove(likes);
				break;
			}
		}
		post.setPostLikes(postLikes);
		postRepo.save(post);
	}

	@Override
	public void commentUnlike(long post_id, long user_id) {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Map<String, Comment>> getPostComment(long post_id) throws SomethingWentWrong {
		// TODO Auto-generated method stub
		
		Optional<Post> postOpt = postRepo.findById(post_id);
		if (postOpt.isEmpty()) {
			throw new SomethingWentWrong("post not found");
		    // Now you can safely use the 'post' object.
		}
		Post post = postOpt.get();    

		List<Comment> list = post.getComments();
		List<Map<String, Comment>> allMaps = new ArrayList<>();

		for (Comment com : list) {
			Optional<UserProfile> upOpt = userProfileRepo.findById(com.getUser());			
			if(upOpt.isPresent()) {
				Map<String, Comment> map = new HashMap<>();
				map.put(upOpt.get().getName() + " (" + upOpt.get().getUsername() + ") ", com);
				allMaps.add(map);
			}			
		}
		return allMaps;

	}

	@Override
	public UserProfile findUserById(long id) {
		// TODO Auto-generated method stub
		Optional<UserProfile> userOpt = userProfileRepo.findById(id);
		UserProfile user = userOpt.get();
		return user;
	}

	@Override
	public UserProfile updateUserProfile(long id, UserProfile user) {
		// TODO Auto-generated method stub
		Optional<UserProfile> userOpt = userProfileRepo.findById(id);
		UserProfile OriginalUser = userOpt.get();

		if (user.getName() != null) {
			OriginalUser.setName(user.getName());
		}
		if (user.getUsername() != null) {
			OriginalUser.setUsername(user.getUsername());
		}
		if (user.getEmail() != null) {
			OriginalUser.setEmail(user.getEmail());
		}
		if (user.getPostCategory().size() >= 3) {
			OriginalUser.setPostCategory(user.getPostCategory());
		}
		userProfileRepo.save(OriginalUser);

		return OriginalUser;
	}

	@Override
	public Boolean changePassword(long user_id, String oldPassword, String newPassword) throws SomethingWentWrong {
		// TODO Auto-generated method stub

		Optional<UserProfile> userOpt = userProfileRepo.findById(user_id);
		UserProfile user = userOpt.get();

		// System.out.println(user.getPassword());
		// System.out.println(passwordEncoder.encode(oldPassword));

		// Verify if the old password matches the stored bcrypt-encoded password
		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			return false;
		}
   
		// Generate a new bcrypt-encoded password for the new password
		String newEncodedPassword = passwordEncoder.encode(newPassword);

		user.setPassword(newEncodedPassword);
		userProfileRepo.save(user);
		return true;
	}

	@Override
	public List<Post> getUserPost(long id) {
		// TODO Auto-generated method stub
		Optional<UserProfile> userOpt = userProfileRepo.findById(id);
		UserProfile user = userOpt.get();

		List<Post> posts = user.getPost();

		return posts;
	}

	@Override
	public void uploadImage(long userId, MultipartFile file) throws IOException {
		// TODO Auto-generated method stub
		Optional<UserProfile> userOpt = userProfileRepo.findById(userId);
		UserProfile user = userOpt.get();

		user.setImage(file.getBytes());
		userProfileRepo.save(user);
	}

	// Post searching
	@Override
	public List<Post> searchPost(String keyword) {
		// TODO Auto-generated method stub
		List<Post> posts = postRepo.findByTitleOrTweetContaining(keyword);
		return posts;
	}

	@Override
	public List<UserProfile> SearchUser(String keyword) {
		// TODO Auto-generated method stub
		return userProfileRepo.searchUserByName(keyword);
	}

	@Override
	public Set<String> notification(long id) {
		// TODO Auto-generated method stub
		UserProfile user = findUserById(id);
		
		List<Post> userPosts = user.getPost();
		
		Set<UserProfile> followings = user.getFollowing();
		
		Set<String> notifications = new HashSet<>();
		
		
		
		return null;
	}

	@Override
	public Post getPostById(long id) {
		// TODO Auto-generated method stub
		Optional<Post> postOpt = postRepo.findById(id);
	    Post post = postOpt.get();
	    return post;
	}

}
