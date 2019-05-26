Feature: Is john is the authorized user?
  Everybody wants to know whether the user is john or not

  Scenario Outline: current user john is authorized or not
    Given user name is "<name>"
    When I try to authorize user john
    Then I should get "<answer>"

  Examples:
    | name            | answer |
    | John         | true |
    | shammyQ         | false |
    | anything else! | false |