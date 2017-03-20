Feature: Timeout page

  Background:
    Given I am Normin

  Scenario: Order timed out
    Given I hit the timeout page with a model that has conflicts
    And I have added items to an order
    And I have performed no activity for more than 30 minutes
    When I am listing the main categories
    Then I am redirected to the timeout page
    And I am informed that my items are no longer reserved for me

  @javascript @browser
  Scenario: View
    Given I hit the timeout page with a model that has conflicts
    Then I see my order
    And the no longer available items are highlighted
    And I can delete entries
    And I can edit entries
    And I can return to the main order overview

  @javascript @browser 
  Scenario: Deleting an entry
    Given I hit the timeout page with a model that has conflicts
    And I delete one entry
    Then the entry is deleted from the order

  @javascript @browser 
  Scenario: Can't add to order
    Given I hit the timeout page with 2 models that have conflicts
    When I click on "Continue this order"
    Then I am redirected to the timeout page
    And I see an error message
    When I correct one of the errors
    And I click on "Continue this order"
    Then I am redirected to the timeout page
    And I see an error message
    When I correct all errors
    Then the error message appears

  @javascript @browser
  Scenario: Delete an order
    Given I hit the timeout page with a model that has conflicts
    When I delete the order
    Then I am asked whether I really want to delete
    And I am on the main category list
    And the models in my order are released
    And the user's order has been deleted

  Scenario: Only use those models that are available to continue with your order
    Given I hit the timeout page with a model that has conflicts
    When a model is not available
    And I click on "Continue with available models only"
    Then the unavailable models are deleted from the order
    And I am redirected to my current order
    And I am informed that the remaining models are all available

  @javascript @browser 
  Scenario: Modifying an entry
    Given I hit the timeout page with a model that has conflicts
    And I change the entry
    And the calendar opens
    And I change the date
    And I save the booking calendar
    Then the entry's date is changed accordingly
    And the entry is grouped based on its current start date and inventory pool
    And I am redirected to the timeout page

  @javascript @browser 
  Scenario: Decreasing the quantity of one entry
    Given I hit the timeout page with a model that has conflicts
    When I increase the quantity of one entry
    Then the entry's date is changed accordingly
    And the entry is grouped based on its current start date and inventory pool
    When I decrease the quantity of one entry
    Then the entry's date is changed accordingly
    And the entry is grouped based on its current start date and inventory pool
    And I am redirected to the timeout page
