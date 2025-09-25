package com.projectrux.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailDto {

    String receiverMail;

    String subject;

    String body;
}
