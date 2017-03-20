Feature: Item Hover on daily view

  In order to see the reservations of a contract
  As a Manager
  I want to see a list of reservations on hover

  Background:
    Given I am Pius

  @upcoming
  Scenario Outline: Hover item cell to see reservations
    When I navigate to the <target>
    And I hover an item's cell
    Then I see a list of items
    And items of the same models are merged
    And I see the quantity for each merged line
  Examples:
    | target           |
    | open orders      |
    | hand over visits |
    | take back visits |
