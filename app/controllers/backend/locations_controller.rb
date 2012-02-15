class Backend::LocationsController < Backend::BackendController

  before_filter do
    params[:id] ||= params[:location_id] if params[:location_id]
    @location = current_inventory_pool.locations.find(params[:id]) if params[:id]

    @tabs = []
    @tabs << :location_backend if @location
  end

######################################################################

  def index
    # OPTIMIZE 0501 
    params[:sort] ||= 'buildings.name'
    params[:sort_mode] ||= 'ASC'
    params[:sort_mode] = params[:sort_mode].downcase.to_sym

    @locations = Location.search2(params[:query]).
                          filter2(:inventory_pool_id => current_inventory_pool.id).
                          paginate(:page => params[:page], :per_page => $per_page).
                          order("#{params[:sort]} #{params[:sort_mode]}")

    respond_to do |format|
      format.html
      format.js { search_result_rjs(@locations) }
    end

  end

  # still used by search
  def show
    @location ||= Location.new
  end

  def destroy
    @location.destroy
    redirect_to(backend_inventory_pool_locations_path(current_inventory_pool))
  end

end
  
