package com.cts.config;

import feign.RequestInterceptor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfigs {

    @Bean
    public ModelMapper modelMapper() { 
        return new ModelMapper(); 
    }
    
    @Bean
    public RequestInterceptor feignRequestInterceptor() {
        return new FeignClientInterceptor();
    }
}
