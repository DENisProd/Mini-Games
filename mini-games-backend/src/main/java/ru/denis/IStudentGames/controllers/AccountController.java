package ru.denis.IStudentGames.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.denis.IStudentGames.models.ResponseDTO;
import ru.denis.IStudentGames.services.Account.AccountService;

@RestController
@RequestMapping("/account")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("")
    public ResponseEntity<?> getBalance (@Param("clientId") String clientId) {
        try {
            double balance = accountService.getAccountBalanceByClientId(clientId);
            return ResponseEntity.ok().body(new ResponseDTO<Double>("ok", true, balance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ResponseDTO<String>("client not exists", false));
        }
    }
}
