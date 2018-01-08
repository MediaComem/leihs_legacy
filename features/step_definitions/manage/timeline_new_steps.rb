# -*- encoding : utf-8 -*-

def user_by_login(login)
  User.find_by(login: login)
end

def create_pool(login, name, description)
  ip3 = FactoryGirl.create(:inventory_pool, name: name, description: description)
  FactoryGirl.create(:access_right, user: user_by_login(login), inventory_pool: ip3, role: :inventory_manager)
end

def create_model(product_name)
  FactoryGirl.create(:model, product: product_name)
end

def model_by_product_name(product_name)
  Model.find_by(product: product_name)
end

def create_item(ip_name, product_name, inventory_code)
  m = model_by_product_name(product_name)
  ip = inventory_pool_by_name(ip_name)
  FactoryGirl.create(:item, model: m, inventory_pool: ip, inventory_code: inventory_code, owner: ip)
end

def create_a_user(login)
  FactoryGirl.create(:user, login: login)
end

def do_logout
  visit logout_path
  find('#flash')
end

def do_login(login, password)
  do_logout

  click_on _('Login')
  fill_in _('Username'), with: login
  fill_in _('Password'), with: password
  click_on _('Login')
end

def inventory_pool_by_name(name)
  InventoryPool.find_by(name: name)
end

def open_timeline(inventory_pool_name, product_name)
  ip = inventory_pool_by_name(inventory_pool_name)
  m = model_by_product_name(product_name)
  visit "/manage/#{ip.id}/models/#{m.id}/timeline"
  binding.pry
end

def execute_scenario
  create_a_user('User1')
  create_pool('User1', 'Ip3', 'Description3')
  create_model('Model1')
  create_item('Ip3', 'Model1', 'Inv1')
  do_login('User1', 'password') # Default password in user_factory.rb
  open_timeline('Ip3', 'Model1')
end

Then /^Check timeline$/ do
  execute_scenario
end
