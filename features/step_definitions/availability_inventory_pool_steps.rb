Given "$size inventory pools" do | size |
  size.to_i.times do |i|
    Factory.create_inventory_pool(:name => (i+1))
  end
  @inventory_pools = InventoryPool.all
  @inventory_pools.size.should == size.to_i
end

Given "1 inventory pool" do 
  Given "1 inventory pools"
end

Given "this model has $number item$s in inventory pool $ip" do |number, s, ip|
  inventory_pool = InventoryPool.find_by_name(ip)
  number.to_i.times do | i |
    Factory.create_item(:model => @model, :inventory_pool => inventory_pool)
  end
  inventory_pool.items.count(:conditions => {:model_id => @model.id}).should == number.to_i
end

Given "user '$who' has access to inventory pool $ip_s" do |who, ip_s|
  user = Factory.create_user({:login => who
                                #, :password => "pass"
                              })
  ip_s.split(" and ").each do |ip_name|
    Factory.define_role(user, "customer", ip_name)
    user.inventory_pools.include?(InventoryPool.find_by_name(ip_name)).should == true
  end
end

Then "the maximum number of available '$model' for '$who' is $size" do |model, who, size|
  user = User.find_by_login(who)
  @model = Model.find_by_name(model)
  user.items.count(:conditions => {:model_id => @model.id}).should == size.to_i
end

###########################################################################

When "'$who' order$s $quantity '$model'" do |who, s, quantity, model|
  post "/session", :login => who #, :password => "pass"
  get '/user/order'
  @order = assigns(:order)
  model_id = Model.find_by_name(model).id
  post add_line_user_order_path(:model_id => model_id, :quantity => quantity)
  @order = assigns(:order)
  @line = @order.order_lines.last # TODO drop @line
end


When "'$who' order$s $quantity '$model' from inventory pool $ip" do |who, s, quantity, model, ip|
  post "/session", :login => who #, :password => "pass"
  get '/user/order'
  @order = assigns(:order)
  model_id = Model.find_by_name(model).id
  inv_pool = InventoryPool.find_by_name(ip)
  post add_line_user_order_path(:model_id => model_id, :quantity => quantity, :inventory_pool_id => inv_pool.id)
  @order = assigns(:order)
  @line = @order.order_lines.scoped_by_inventory_pool_id(ip).last  # TODO drop @line ??
end

Then /([0-9]+) order(s?) exist(s?) for inventory pool (.*)/ do |size, s1, s2, ip|
  inventory_pool = InventoryPool.find_by_name(ip)
  @orders = inventory_pool.orders.submitted
  @orders.size.should == size.to_i
end

Then /it asks for ([0-9]+) item(s?)$/ do |number, s|
  total = 0
  @orders.each do |o|
    total += o.lines.collect(&:quantity).sum
  end
  total.should == number.to_i
end

Then "user '$user' gets notified that his order has been submitted" do |who|
  user = Factory.create_user({:login => who })
  user.notifications.size.should == 1
  user.notifications.first.title = "Order submitted"
end

###########################################################################

When "'$who' searches for '$model' on frontend" do |who, model|
  post "/session", :login => who #, :password => "pass"
  get models_path(:query => model)
  @models = assigns(:models)
end

Then "he gets an empty result set" do
  @models.empty?.should == true
end

Then "he sees the '$model' model" do |model|
  m = Model.find_by_name(model)
  @models.include?(m).should == true
end

When "'$user' orders another $quantity '$model' for the same time" do |user, quantity, model|
  model_id = Model.find_by_name(model).id
  post add_line_user_order_path(:model_id => model_id, :quantity => quantity)
  @order = assigns(:order)
end

Then "all order lines should be available" do
  @order.order_lines.all?{|l| l.available? }.should be_true
end

Then "some order lines should not be available" do
 @order.order_lines.any?{|l| not l.available? }.should be_true
end
