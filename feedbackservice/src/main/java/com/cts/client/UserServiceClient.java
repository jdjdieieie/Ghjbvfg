package com.cts.client;

import com.cts.model.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USERSERVICEAPP", path = "/api/v1/users")
public interface UserServiceClient {
    
    @GetMapping("/email/{email}")
    User getUserByEmail(@PathVariable("email") String email);
}
