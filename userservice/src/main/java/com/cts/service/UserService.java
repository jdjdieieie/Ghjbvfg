package com.cts.service;

import com.cts.dto.request.RegisterCustomerRequestDTO;
import com.cts.dto.request.RegisterDeliveryPartnerRequestDTO;
import com.cts.dto.response.*;

import java.util.List;

public interface UserService {
	public List<UserResponseDTO> findAllUsers(String userType);
	public UserResponseDTO getUserById(long id);
	public UserResponseDTO getUserByEmail(String email);
	public String deleteUser(long id);
	public RegisterCustomerResponseDTO updateCustomer(RegisterCustomerRequestDTO registerRequestDTO);
	public RegisterDeliveryPartnerResponseDTO updateDeliveryPartner(RegisterDeliveryPartnerRequestDTO dp);
	public UserResponseDTO updateAvailabilityStatus(long id, Boolean available, boolean systemUpdate);
	public UserResponseDTO updateUserStatus(long id, boolean status);
	public List<UserResponseDTO> searchActiveDeliveryPartnersByName(String name);
	public List<UserResponseDTO> searchActiveCustomersByName(String name);
	public List<UserResponseDTO> getActiveDeliveryPartners();
	public List<UserResponseDTO> getActiveCustomers();
	public UserResponseDTO updateTotalOrders(long id);
	

}