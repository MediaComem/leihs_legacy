module LeihsAdmin
  class FieldsController < AdminController

    def index
      @grouped_fields = Field.unscoped.order(:position).sort_by do |f|
        [Field::GROUPS_ORDER.index(f.data['group']) || 999, f.position]
      end.group_by { |f| f.data['group'] }
    end

    def edit_react
      fields = Field.all.map do |f|
        {
          id: f.id,
          active: f.active,
          position: f.position,
          data: f.data
        }
      end
      @props = {
        fields: fields,
        new_path: fields_new_react_path,
        update_path: fields_update_react_path
      }
    end

    def new_react
      field = Field.new
      field.id = params[:field][:id]
      field.data = params[:field][:data].to_h
      field.position = 0
      field.active = false
      field.save!
      respond_to do |format|
        format.json do
          render(status: :ok, json: {result: 'field-saved'})
        end
      end

    end

    def update_react
      field_id = params[:field][:id]
      field = Field.find(field_id)
      field.data = params[:field][:data].to_h
      field.position = params[:field][:position].to_i
      field.active = params[:field][:active] == 'true'
      field.save!
      respond_to do |format|
        format.json do
          render(status: :ok, json: {result: 'field-saved'})
        end
      end
    end

    def batch_update
      ApplicationRecord.transaction do
        begin
          params.require(:fields).each_pair do |field_id, field_spec|
            field = Field.unscoped.find(field_id)
            is_active = get_active_status_value!(field, field_spec)
            field.update_attributes!(active: is_active)
          end
          flash[:success] = _('Fields have been updated successfully.')
        rescue => e
          flash[:error] = e.message
        end

        redirect_to admin.fields_path
      end
    end

    private

    def get_active_status_value!(field, field_spec)
      case field_spec.require(:active)
      when '0'
        if field.data['required']
          raise "Disabling a required field #{field.id} is not possible!"
        end
        false
      when '1'
        true
      else
        raise 'Invalid active state for the field!'
      end
    end
  end
end
