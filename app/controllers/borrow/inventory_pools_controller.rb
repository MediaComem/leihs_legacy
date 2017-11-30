class Borrow::InventoryPoolsController < Borrow::ApplicationController

  def index
    @inventory_pools = \
      current_user
        .inventory_pools
        .only_active_inventory_pools
        .with_borrowable_items
        .sort_by { |ip| ip.name.downcase }
  end
end
