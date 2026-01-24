package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.app.pojos.UserTable;

public interface UserTableRepo extends JpaRepository<UserTable, Long> {
	
	@Query("SELECT COUNT(u) FROM UserTable u")
    Long countRegisteredUsers();

}
