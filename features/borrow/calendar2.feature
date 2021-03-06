
Feature: Calendar

  Background:
    Given I am Normin

  Scenario: Calendar components
    When I add an item from the model list
    Then the calendar opens
    And the calendar contains all necessary interface elements

  Scenario: Default appearance of the calendar
    When I add an item from the model list
    Then the calendar opens
    And the current start date is today
    And the end date is tomorrow
    And the quantity is 1
    And all inventory pools are shown that have items of this model

  Scenario: Calendar appearance with date already set
    Given I am listing models
    And I have set a time span
    When I add an item to my order that is available in the selected time span
    Then the calendar opens
    And the start date is equal to the preselected start date
    And the end date is equal to the preselected end date

  Scenario: Calendar appearance with inventory pools already set
    Given I am listing models
    And I reduce the selected inventory pools
    And I add a model to the order that is available across all the still remaining inventory pools
    Then the calendar opens
    And that inventory pool which comes alphabetically first is selected
    And I select an inventory pool with holidays
    Then any holidays of the selected inventory pool are shown

  Scenario: Jumping back and forth between months in the calendar
    Given I have opened the booking calendar
    When I jump back and forth between months
    Then the calendar shows the currently selected month

  Scenario: Jumping to start and end date in the calendar
    Given I have opened the booking calendar
    When I use the jump button to jump to the current start date
    Then the start date is shown in the calendar
    When I use the jump button to jump to the current end date
    Then the end date is shown in the calendar

  Scenario: Adding an item to my order
    When I am listing some available models
    And I add an existing model to the order
    Then the calendar opens
    When everything I input into the calendar is valid
    Then the model has been added to the order with the respective start and end date, quantity and inventory pool

  Scenario: Maximal quantity available in the calendar
    Given I have opened the booking calendar
    Then the maximum available quantity of the chosen model is displayed
    When I enter a higher quantity than the total borrowable for the selected pool
    Then the booking calendar shows an error message
    And the add button is disabled

  Scenario: Inventory pools that are available in the calendar
    Given I have opened the booking calendar
    Then only those inventory pools are selectable that have capacities for the chosen model
    And the inventory pools are sorted alphabetically

  Scenario: Showing closed days in the calendar
    Given I have opened the booking calendar

  Scenario: Using the calendar after resetting all filters
    When I add a model to an order
    And I am listing models
    And I choose the second inventory pool from the inventory pool list
    When I reset all filters
    And I press "Add to order" on a model
    Then the calendar opens
    When everything I input into the calendar is valid
    Then the model has been added to the order with the respective start and end date, quantity and inventory pool

  Scenario: Ordering something that only groups may have
    When a model exists that is only available to a group
    Then I cannot order that model unless I am part of that group

  Scenario: Ordering not possible when selection isn't available
    When I try to add a model to the order that is not available
    Then my attempt to add it fails
    And the error lets me know that the chosen model is not available in that time range

  Scenario: Closing the calendar
    When I am listing models
    And I press "Add to order" on a model
    Then the calendar opens
    When I close the calendar
    Then the dialog window closes

  Scenario: Availability display on the calendar
    Given there is a model for which an order exists
    When I add this model from the model list
    Then the calendar opens
    And that model's availability is shown in the calendar

  Scenario: Availability display on the calendar after changing calendar dates
    Given there is a model for which an order exists
    When I add this model from the model list
    Then the calendar opens
    When I change start and end date
    Then the availability for that model is updated
    When I set the quantity in the calendar to 2
    Then the availability for that model is updated
