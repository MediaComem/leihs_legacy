module Procurement
  class CategoryInspector < ApplicationRecord

    validates_presence_of :user, :category
    validates_uniqueness_of :user_id, scope: :category_id

    belongs_to :user
    belongs_to :category

  end
end
