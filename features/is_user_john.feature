Feature: Is the user is John?
  Everybody wants to know whether the user is john or not

  Scenario Outline: current user is john or not
    Given user name is "<name>"
    When I ask whether the user is john
    Then I should be told "<answer>"

  Examples:
    | name            | answer |
    | John         | Yes name is john |
    | shammyQ         | Sorry! Another user |
    | anything else! | Sorry! Another user |