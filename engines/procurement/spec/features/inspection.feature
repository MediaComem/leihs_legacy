Feature: Inspection (state-behaviour described in seperate feature-file)

  Background:
    Given the basic dataset is ready

  @inspection
  Scenario: What to see in section "Requests" as inspector
    Given I am Barbara
    And several requests exist for my categories
    When I navigate to the requests overview page
    Then the current budget period is selected
    And only my categories are selected
    And only categories having requests are selected
    And all organisations are selected
    And both priorities are selected
    And all inspector's priorities are selected
    And the state "In inspection" is not present
    And all states are selected
    And the search field is empty
    And the checkbox "Only show my own request" is not marked
    And I see the headers of the columns of the overview
    And I see the amount of requests listed
    And I see the current budget period
    And I see the total amount of each sub category for each budget period
    And the total amount is calculated by adding the following amounts
      | quantity  | state              |
      | requested | new                |
      | order     | accepted           |
      | order     | partially accepted |
    And I see the total of all budget limits of the shown main categories for each budget period
    And I see the budget limit of each main category for each budget period
    And I see the total amount of each main category for each budget period
    And the total amount is calculated by adding all totals of the sub category
    And I see the percentage of budget used compared to the budget limit of the main categories
    And I see when the requesting phase of this budget period ends
    And I see when the inspection phase of this budget period ends
    And for each request I see the following information
      | article name          |
      | name of the requester |
      | organisation          |
      | price                 |
      | requested amount      |
      | approved amount       |
      | order amount          |
      | total amount          |
      | priority              |
      | state                 |

  @inspection
  Scenario Outline: Which fields are not editable
    Given I am <username>
    And a request with following data exist
      | key                | value   |
      | user               | Roger   |
    When I open this request
    Then the following fields are not editable
      | Motivation         |
      | Priority           |
  Examples:
    | username  |
    | Barbara   | # Inspector
    | Hans Ueli | # Admin

  @inspection
  Scenario Outline: Editing a request in the overview
  Given I am <username>
    And a room 'Room 2' for building 'Building 2' exists
    And a request with following data exist
      | key                        | value       |
      | user                       | Roger       |
      | article or project         | MyProject   |
      | article nr. or producer nr.| 1234        |
      | supplier                   | Dell        |
      | name of receiver           | Markus      |
      | building                   | Building    |
      | room                       | Room        |
      | replacement                | Replacement |
      | price                      | 100         |
      | requested amount           | 1           |

    When I navigate to the requests overview page
     And I open the requests main category
     And I open the requests category
    Then I see the request line


    When I click on the request line
    Then I see the request inline edit form

    When I fill in the following fields
      | key                        | value       |
      | Article or Project         | MyProject2  |
      | Article nr. or Producer nr.| 12345       |
      | Supplier                   | Digitec     |
      | Name of receiver           | Stefan      |
      | Building                   | Building 2  |
      | Room                       | Room 2      |
      | Replacement / New          | New         |
      | Price                      | 1000        |
      | Requested quantity         | 2           |
    And I upload a file
    Then the total sum is updated
    When I save the inline form
    Then I see the updated request line
    And the request with all given information was updated successfully in the database
    And the uploaded file is now an attachment of the request
  Examples:
    | username  |
    | Barbara   | # Inspector
    | Hans Ueli | # Admin

  @inspection
  Scenario: Using the filters as inspector
    Given I am Barbara
    And following requests exist for the current budget period
      | quantity | user   | category  |
      | 2        | myself | inspected |
      | 1        | Roger  | inspected |
    When I navigate to the requests overview page
    And I select the current budget period
    And I select all categories
    And I select "Only my own requests"
    And I select "Only my own categories"
    And I select "Only categories with requests"
    And I select all organisations
    And I select both priorities
    And I select all inspector's priorities
    And I select all states
    And I leave the search string empty
    Then the list of requests is adjusted immediately
    And I see only my own requests
    And I see the amount of requests which are listed is 2
    And only categories having requests are shown
    When I deselect "Only my own requests"
    Then I see all requests
    And I see the amount of requests which are listed is 3
    When I deselect "Only my own categories"
    Then all categories are selected
    When I navigate to the templates page
    And I navigate back to the request overview page
    Then the filter settings have not changed

  # this scenario is a reaction to a bug:
  # if multiple budget periods were selected, then no categories with requests were selected,
  # although there have been some. It was working for a single budget period however.
  @inspection
  Scenario: Check proper display of categories with requests if multiple budget periods are selected
    Given I am Barbara
    And several budget periods exist
    And following requests exist for the current budget period
      | quantity | user   | category  |
      | 2        | myself | inspected |
      | 1        | Roger  | inspected |
    When I navigate to the requests overview page
    And I select all budget periods
    And I select "Only categories with requests"
    Then the list of requests is adjusted immediately
    And only categories having requests are shown

  @inspection
  Scenario: Creating a request as inspector
    Given I am Barbara
    And a receiver exists
    And a room 'Room' for building 'Building' exists
    When I navigate to the requests overview page
    And I press on the plus icon of a sub category
    Then I am navigated to the request form
    When I fill in the following fields
      | key                        | value  |
      | Article or Project          | random |
      | Article nr. or Producer nr. | random |
      | Supplier                   | random |
      | Motivation                 | random |
      | Price                      | random |
      | Requested quantity         | 3      |
      | Approved quantity          | 3      |
    Then the "Approved quantity" is copied to the field "Order quantity"
    And I fill in the following fields
      | key            | value        |
      | Order quantity | 2            |
    And the ordered amount and the price are multiplied and the result is shown
    When I upload a file
    And I choose the name of a receiver
    And I choose building "Building"
    And I choose room "Room"
    And I choose the following priority value
      | High |
    And I choose the following inspector's priority value
      | High |
    And I choose the following replacement value
      | New |
    And the status is set to "New"
    And I click on save
    Then I see a success message
    And the request with all given information was created successfully in the database

  Scenario Outline: Inspector's Priority values
    Given I am Barbara
    When I want to create a new request
    Then the Inspector's priority value "Medium" is set by default
    And I can choose the following values
      | Mandatory   |
      | High        |
      | Medium      |
      | Low         |

  @inspection
  Scenario: Creating a request for another user
    Given I am Barbara
    When I navigate to the requests overview page
    And I press on the Userplus icon of a sub category I am inspecting
    Then I am navigated to the requester list
    When I pick a requester
    Then I am navigated to the new request form for the requester
    When I fill in all mandatory information
    And I click on save
    Then I see a success message
    And the request with all given information was created successfully in the database

  @inspection
  Scenario: Give Reason when Denying
    Given I am Barbara
    And a request with following data exist
      | key              | value   |
      | budget period    | current |
      | user             | Roger   |
      | requested amount | 2       |
    When I open this request
    And I fill in the following fields
      | key               | value |
      | Approved quantity | 0     |
    Then the field "inspection comment" is marked red
    And I can not save the request
    When I fill in the following fields
      | key                | value  |
      | Inspection comment | random |
    And I click on save
    Then I see the updated request line
    And the status is set to "Denied"
    And the changes are saved successfully to the database

  @inspection @flapping
  Scenario: Give Reason when Partially Excepting
    Given I am Barbara
    And a request with following data exist
      | key              | value   |
      | budget period    | current |
      | user             | Roger   |
      | requested amount | 2       |
    When I open this request
    When I delete the following fields
      | Inspection comment |
    And I fill in the following fields
      | key               | value |
      | Approved quantity | 1     |
    Then the field "inspection comment" is marked red
    And I can not save the request
    When I fill in the following fields
      | key                | value  |
      | Inspection comment | random |
    And I click on save
    Then I see the updated request line
    And the status is set to "Partially approved"
    And the changes are saved successfully to the database

  @inspection
  Scenario: Overview Edit Form with changes can only be opened one at a time
    Given I am Barbara
    And a request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject1  |
    And a 2. request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject2  |

    When I open this request
    Then I see the 1. request inline edit form

    When I change any text input field in the request form
    And I try to open the 2. request
    Then I see the 1. request inline edit form

  @inspection
  Scenario: Overview Edit Form with changes can not be hidden
    Given I am Barbara
    And a request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject2  |
    And I open this request
    And I change any text input field in the request form

    When I try to close the requests main category
    Then I see the request inline edit form

    When I try to close the requests category
    Then I see the request inline edit form

    When I try to toggle a filter
    Then I see the request inline edit form

  @inspection @flapping
  Scenario: Overview Edit Form with changes blocks navigation with confirmation
    Given I am Barbara
    And a request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject2  |
    And I open this request
    And I change any text input field in the request form

    When I try to navigate to the templates page
    And I cancel the alert popup
    Then I see the request inline edit form

    When I try to navigate to the templates page, confirming to leave the page
    Then I am navigated to the templates page

  @inspection
  Scenario: Overview Edit Form shows error message on invalid data
    Given I am Barbara
    And a request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject2  |
    When I open this request
    When I fill in the following fields

      | key                | value |
      | Article or Project | " "   | # single space
    And I save the inline form
    Then the inline form has an error message "Article name muss ausgefüllt werden"

  @inspection
  Scenario: Moving request to another budget period as inspector
    Given I am Barbara
    And the current budget period is in inspection phase
    And there is a future budget period
    And there is a budget period which has already ended
    And a request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject2  |
    When I open this request
    Then I can not move any request to the old budget period
    When I move a request to the future budget period
    Then I see a success message
    And the following information is deleted from the request
      | Approved quantity  |
      | Order quantity     |
    And the value of the field inspector's priority is set to the default value
    And the changes are saved successfully to the database

  @inspection
  Scenario: Moving request as inspector to another category
    Given I am Barbara
    And several categories exist
    And the current budget period is in inspection phase
    And a request with following data exist
      | key                | value       |
      | budget period      | current     |
      | user               | Roger       |
      | article or project | MyProject2  |
    When I open this request
    And I move a request to the other category where I am not inspector
    Then I see a success message
    And the changes are saved successfully to the database
    And the following information is deleted from the request
      | Approved quantity  |
      | Order quantity     |
      | Inspection comment |
    And the value of the field inspector's priority is set to the default value
