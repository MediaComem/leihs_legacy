class Borrow::UsersController < Borrow::ApplicationController

  def current
    if current_user.authentication_system.class_name == 'DatabaseAuthentication'
      @db_auth = DatabaseAuthentication.find_by_user_id(current_user.id)
    end
  end

  def documents
    @contracts = current_user.contracts
    @contracts = \
      @contracts.to_a.sort { |a, b| a.time_window_min <=> b.time_window_min }
  end

  def delegations
    @delegations = current_user.delegations.customers
  end

  def switch_to_delegation
    if delegation = current_user.delegations.find(params[:id])
      user_session.update_attributes! delegation_id: delegation.id
    end
    redirect_to borrow_root_path
  end

  def switch_back
    user_session.update_attributes! delegation_id: nil
    redirect_to borrow_root_path
  end

  ################################################################

  before_action only: [:contract, :value_list] do
    @contract = current_user.contracts.find(params[:id])
  end

  def contract
    @user = @contract.user
    @delegated_user = @contract.delegated_user
    @inventory_pool = @contract.inventory_pool
    render 'documents/contract', layout: 'print'
  end

  def value_list
    @user = @contract.user
    @delegated_user = @contract.delegated_user
    @inventory_pool = @contract.inventory_pool
    render 'documents/value_list', layout: 'print'
  end

end
