Feature: Change who ordered something

  Background:
    Given I am Pius

  Scenario: Changing the person who ordered something
    Given I open an order
    Then I can change who placed this order
