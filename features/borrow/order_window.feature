Feature: Order window

  This all happens in the borrow section.

  Background:
    Given I am Normin

  Scenario: Order window
    Given I am on the main category list
    Then I see the order window

  Scenario: No order window
    Given I am viewing my current order
    Then I do not see the order window

  Scenario: Content of the order window
    When I add a model to an order
    Then it appears in the order window
    And the models in the order window are sorted alphabetically
    And identical models are collapsed
    When I add the same model one more time
    Then its quantity is increased
    And the models in the order window are sorted alphabetically
    And identical models are collapsed
    And I can go to the detailed order overview

  @javascript @browser 
  Scenario: Updating the order window from the calendar
    When I add a model to the order using the calendar
    Then the order window is updated

  @javascript 
  Scenario: Showing how much time is left for ordering
    Given my order is empty
    When I am listing the main categories
    Then I don't see a timer
    When I add a model to an order
    Then I see a timer
    And the timer is near the basket
    And the timer counts down from 30 minutes

  Scenario: Reset timer
    Given my order is not empty
    Then I see a timer

    When I reset the timer
    Then the timer is reset
