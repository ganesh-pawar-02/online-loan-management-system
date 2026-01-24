package com.app.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.app.pojos.UserTable;
import com.app.repository.UserTableRepo;
  

@RestController
@RequestMapping("/api/users/AllUsers")
@CrossOrigin(origins = "*") 
//@CrossOrigin(origins = "http://localhost:3000") 
public class UserTableController {
	@Autowired
	private UserTableRepo userrepo;
	
	@GetMapping
	public List<UserTable>getAllUsers(){
		return userrepo.findAll();
	}
	
	@GetMapping("/count")
    public Long getRegisteredUsersCount() {
        return userrepo.countRegisteredUsers();
    }

}
