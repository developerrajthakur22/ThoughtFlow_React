package com.flow.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.flow.Entity.User;
import com.flow.Entity.UserProfile;
import com.flow.Repository.UserProfileRepo;

@Service
public class ManualUserDetailService implements UserDetailsService{

	@Autowired
	private UserProfileRepo userRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Optional<UserProfile> userOpt = userRepo.findByUsernameOrEmail(username);
		
		if(userOpt.isEmpty()) {
			throw new UsernameNotFoundException("User not found");
		}
		
		User user = userOpt.get();
		
		List<GrantedAuthority> authorities = new ArrayList<>();
		
		SimpleGrantedAuthority auth = new SimpleGrantedAuthority("ROLE_" + user.getRole());
		authorities.add(auth);
		
		MyUserDetails secUser = new MyUserDetails(user, authorities);
		
		// TODO Auto-generated method stub
		return secUser;
	}

}
