# -*- encoding : utf-8 -*-

def user_by_login(login)
  User.find_by(login: login)
end

def create_pool(name, description)
  ip3 = FactoryGirl.create(:inventory_pool, name: name, description: description)
end

def create_model(product_name, maintenance_period)
  FactoryGirl.create(:model, product: product_name, maintenance_period: maintenance_period)
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

def create_reservation(login, ip_name)
  u = user_by_login(login)
  ip = inventory_pool_by_name(ip_name)
  FactoryGirl.create(:reservation, user: u, start_date: Date.today, end_date: Date.tomorrow, inventory_pool: ip)
end

def add_ip_manager(ip_name, login)
  u = user_by_login(login)
  ip = inventory_pool_by_name(ip_name)
  FactoryGirl.create(:access_right, user: u, inventory_pool: ip, role: :inventory_manager)
end

def add_ip_customer(ip_name, login)
  u = user_by_login(login)
  ip = inventory_pool_by_name(ip_name)
  FactoryGirl.create(:access_right, user: u, inventory_pool: ip, role: :customer)
end

def execute_scenario
  create_a_user('User1')
  create_a_user('User2')
  create_pool('Ip3', 'Description3')
  add_ip_manager('Ip3', 'User1')
  add_ip_customer('Ip3', 'User2')
  create_model('Model1', 3)
  create_item('Ip3', 'Model1', 'Inv1')
  create_reservation('User2', 'Ip3')
  do_login('User1', 'password') # Default password in user_factory.rb
  open_timeline('Ip3', 'Model1')
end

Then /^Check timeline$/ do
  execute_scenario
end
