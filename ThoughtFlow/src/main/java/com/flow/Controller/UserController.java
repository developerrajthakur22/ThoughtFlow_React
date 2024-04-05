package com.flow.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.flow.Configuration.JwtToken;
import com.flow.Entity.Post;
import com.flow.Entity.User;
import com.flow.Entity.UserProfile;
import com.flow.Exceptions.NotFoundException;
import com.flow.Exceptions.SomethingWentWrong;
import com.flow.Exceptions.UserAlreadyExist;
import com.flow.Repository.UserProfileRepo;
import com.flow.Repository.UserRepository;
import com.flow.Service.UserService;

@RestController
public class UserController {

//	http://localhost:9990/swagger-ui -- use this URL to check all endpoints

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private UserProfileRepo userProfileRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/addUser")
	public ResponseEntity<User> addUser(@RequestBody UserProfile user) throws SomethingWentWrong, UserAlreadyExist {

	    try {
	        // Attempt to find user by username or email
	        Optional<UserProfile> existingUserByUsername = userProfileRepo.findByUsernameOrEmail(user.getUsername());
	        Optional<UserProfile> existingUserByEmail = userProfileRepo.findByUsernameOrEmail(user.getEmail());

	        // Check if user already exists
	        if (existingUserByUsername.isPresent() || existingUserByEmail.isPresent()) {
	            throw new UserAlreadyExist("User with username '" + user.getUsername() + "' or email '" + user.getEmail() + "' already exists");
	        } else {
	            // Encode the password
	            user.setRole("USER");
	            user.setPassword(passwordEncoder.encode(user.getPassword()));

	            // Create the user
	            User createdUser = userService.createUser(user);
	            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
	        }
	    } catch (UserAlreadyExist e) {
	        // Handle case where user already exists
	        throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
	    } catch (Exception e) {
	        // Handle other exceptions
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error occurred while processing the request", e);
	    }
	}



	@GetMapping("/loginTF")
	public ResponseEntity<UserProfile> login(Authentication auth) throws NotFoundException {
		// Extract and decode Basic Authentication credentials from the header
		System.out.println(auth.getName());
		
		Optional<UserProfile> userOpt = userProfileRepo.findByUsernameOrEmail(auth.getName());
		if (userOpt.isEmpty()) {
			throw new NotFoundException("User not found");
		}

		UserProfile user = userService.findUserById(userOpt.get().getId());
       System.out.println("Logged In with TF: " + user.getName());
		return new ResponseEntity<UserProfile>(user, HttpStatus.OK);
	}

	@PostMapping("/loginUser")
	public ResponseEntity<UserProfile> tokenLogin(@RequestBody String token) {
		String username = JwtToken.decodeJwt(token);
		Optional<UserProfile> opt = userProfileRepo.findByUsernameOrEmail(username);

		UserProfile user = userService.findUserById(opt.get().getId());

		System.out.println("I am in login");
		return new ResponseEntity<UserProfile>(user, HttpStatus.ACCEPTED);
	}

	@DeleteMapping("/delUser/{id}")
	public ResponseEntity<Void> delUser(@PathVariable long id) throws NotFoundException {
		userService.deleteUser(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addToFollowing/{addUser}/{id}")
	public ResponseEntity<UserProfile> addFollower(@PathVariable long addUser, @PathVariable long id) {
		UserProfile u = userService.addToFollowing(addUser, id);
		return new ResponseEntity<UserProfile>(u, HttpStatus.OK);
	}

	@DeleteMapping("/removeFollowing/{userId}/{f_id}")
	public ResponseEntity<Void> removeFolloer(@PathVariable long userId, @PathVariable long f_id) {
		userService.removeFollowing(userId, f_id);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
   
	@PostMapping("/AddPost/{user_id}")
	public ResponseEntity<Post> addPost(@RequestBody Post post, @PathVariable long user_id) {
		Post p = userService.addPost(post, user_id);
		return new ResponseEntity<Post>(p, HttpStatus.ACCEPTED);
	}

	@DeleteMapping("/removePost/{id}/{user_id}")
	public ResponseEntity<Void> removePost(@PathVariable long id, @PathVariable long user_id) {
		userService.removePost(id, user_id);
		return new ResponseEntity<Void>(HttpStatus.ACCEPTED);
	}

	@GetMapping("UserFollowing/{id}")
	public ResponseEntity<Set<UserProfile>> followingList(@PathVariable long id) {
		Set<UserProfile> list = userService.getUserFollowing(id);
		return new ResponseEntity<>(list, HttpStatus.ACCEPTED);
	}

	@GetMapping("UserFollower/{id}")
	public ResponseEntity<Set<UserProfile>> followerList(@PathVariable long id) {
		Set<UserProfile> list = userService.getUserFollowers(id);
		return new ResponseEntity<>(list, HttpStatus.ACCEPTED);
	}

	// Get the user
	@GetMapping("UserProfile/{id}")
	public ResponseEntity<UserProfile> getUserProfile(@PathVariable long id) {
		UserProfile user = userService.findUserById(id);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	// Update the user
	@PutMapping("UpdateUserProfile/{id}")
	public ResponseEntity<UserProfile> updateUserProfile(@RequestBody UserProfile user, @PathVariable long id) {
		UserProfile u = userService.updateUserProfile(id, user);
		return new ResponseEntity<UserProfile>(u, HttpStatus.ACCEPTED);
	}

	// Change password
	@PatchMapping("ChangePassword/{oldPw}/{id}/{newPw}")
	public ResponseEntity<Map> changePassword(@PathVariable long id, @PathVariable String oldPw,
			@PathVariable String newPw) throws SomethingWentWrong {
		boolean status = userService.changePassword(id, oldPw, newPw);
		Map<String, String> response = new HashMap<>();
		String res;
		if(status) {
			res = "Password changed!";
			response.put("Status", res);
			return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
		}else {
			res = "Wrong Password";
			response.put("Status", res);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
	}

	// Set User profile
	@PutMapping("/UploadProfilePic/{userId}")
	public ResponseEntity<Void> uploadProfilePicture(@PathVariable long userId,
			@RequestParam("file") MultipartFile file) throws IOException {
		userService.uploadImage(userId, file);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}

	// Search for user with name or username
	@GetMapping("SearchUser/{keyword}")
	public ResponseEntity<List<UserProfile>> searchUser(@PathVariable String keyword) {
		List<UserProfile> users = userService.SearchUser(keyword);
		return new ResponseEntity<>(users, HttpStatus.OK);
	}

}
