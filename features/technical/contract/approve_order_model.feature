Feature: Send email upon confirmation

  Model test

  Background:
    Given required test data for contract tests existing

  Scenario: A confirmation email should be sent when a contract is confirmed
    Given I am Pius
    And a submitted contract with approvable reservations exists
    When I approve the contract of the borrowing user
    Then the borrowing user gets one confirmation email
    And the subject of the email is "[leihs] Reservation Confirmation"
