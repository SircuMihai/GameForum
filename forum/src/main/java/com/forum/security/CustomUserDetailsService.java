package com.forum.security;

import com.forum.repository.UserAuthView;
import com.forum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserAuthView user = userRepository.findAuthViewByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        com.forum.exception.ErrorMessages.format(
                                com.forum.exception.ErrorMessages.USER_NOT_FOUND_BY_EMAIL, email)));

        Collection<GrantedAuthority> authorities = new ArrayList<>();
        String role = user.getRole() != null ? user.getRole() : "USER";
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

        return User.builder()
                .username(user.getUserEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .disabled(user.isBanned())
                .build();
    }
}
