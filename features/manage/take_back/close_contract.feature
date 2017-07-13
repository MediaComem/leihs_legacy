Feature: Close Contract

  In order to take back things
  As a lending manager
  I want to be able to take back items and close a contract

  Background:
    Given I am Pius

  Scenario: Take back all items of a contract
     When I open a take back
      And I select all reservations of an open contract via Barcode
      And I click take back
     Then I see a summary of the things I selected for take back
     When I click take back inside the dialog
     Then the contract is closed and all items are returned
