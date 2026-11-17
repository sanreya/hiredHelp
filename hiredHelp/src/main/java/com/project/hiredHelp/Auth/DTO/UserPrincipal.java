package com.project.hiredHelp.Auth.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collection;
import java.util.List;

@Getter
@AllArgsConstructor
public class UserPrincipal {

    private Long userId;
    private String name;
    private List<SimpleGrantedAuthority> authorities;
}
