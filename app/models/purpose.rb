class Purpose < ActiveRecord::Base
  has_many :reservations

  # TODO delete not associated purposes
  # validates has at least one reservation

  def to_s
    "#{description}"
  end

end
