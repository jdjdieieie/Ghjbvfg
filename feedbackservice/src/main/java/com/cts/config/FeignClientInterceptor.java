package com.cts.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            
            // Forward authentication headers from the original request
            String userEmail = request.getHeader("X-User-Email");
            String userRole = request.getHeader("X-User-Role");
            String userId = request.getHeader("X-User-Id");
            
            System.out.println("FeignClientInterceptor - Forwarding headers: Email=" + userEmail + ", Role=" + userRole + ", UserId=" + userId);
            
            if (userEmail != null) {
                template.header("X-User-Email", userEmail);
            }
            if (userRole != null) {
                template.header("X-User-Role", userRole);
            }
            if (userId != null) {
                template.header("X-User-Id", userId);
            }
        } else {
            System.out.println("FeignClientInterceptor - No RequestAttributes available, using SecurityContext");
            // Fallback to SecurityContext if RequestAttributes not available
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getName() != null) {
                template.header("X-User-Email", authentication.getName());
                if (authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
                    String role = authentication.getAuthorities().iterator().next().getAuthority();
                    if (role.startsWith("ROLE_")) {
                        role = role.substring(5);
                    }
                    template.header("X-User-Role", role);
                }
            }
        }
    }
}
