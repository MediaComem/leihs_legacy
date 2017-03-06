Given /^pending$/ do
  pending
end

Given 'pending - reported by $who on $date' do |who, date|
  pending
end

Given 'resolved by $who on $date' do |who, date|
  # do nothing
end

Given /^reported by (.*) on (.*)/ do |who, date|
  # do nothing
end

Given /pending - (?!reported by)(.*)/ do |explanation|
  pending
end

Given 'test pending' do
  pending
end

# This step is not active currently, since it is used in a @wip feature.
# It needs to be eventually migrated from culerity to capybara all the same 
When /I fill in (\w+) of "([^\"]*)" with "([^\"]*)"/ do |order, field, value|
  text_fields = $browser.text_fields
  matching = text_fields.find_all { |t| t.id.match( field ) }
  matching[order.to_i].set(value)
end

# Date changing hackery
When 'I beam into the future to $date' do |date|
  Dataset.back_to_date( LeihsFactory.parsedate( date ) )
end

When 'I beam back into the present' do
  Dataset.back_to_date
end

Given(/^today corresponds to the start date of the order$/) do
  if @contract
    Dataset.back_to_date @contract.min_date
  end
  visit current_path # reload the page in order to travel in time also in browser
end

Then 'I close the flash message' do
  # NOTE prevent button not clickabe by over layer
  selector = '#flash .fa-times-circle'
  find(selector).click if has_selector? selector
end

Then 'I close the flash message if visible' do
  flash = first("#flash")
  if flash
    flash.find(".fa-times-circle").click
  end
end
