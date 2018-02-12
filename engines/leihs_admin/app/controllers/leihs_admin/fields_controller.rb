module LeihsAdmin
  class FieldsController < AdminController

    def index
      @grouped_fields = Field.unscoped.order(:position).sort_by do |f|
        [Field::GROUPS_ORDER.index(f.data['group']) || 999, f.position]
      end.group_by { |f| f.data['group'] }
    end

    def edit_react
      @props = {
        all_fields_path: fields_all_fields_path,
        single_field_path: fields_single_field_path,
        new_path: fields_new_react_path,
        update_path: fields_update_react_path,
        fields_path: fields_path
      }
    end

    def destroy
      Field.unscoped.find(params[:id]).destroy!
      respond_to do |format|
        format.json do
          render(status: :ok, json: {})
        end
      end
    end

    def single_field
      field = Field.unscoped.where(dynamic: true).where(id: params[:id]).first
      attribute = field.data['attribute']
      property = attribute[1]

      items_count = Item.where("items.properties::json->>'#{property}' is not null").count

      props = {
        field: presenterify_field(field),
        items_count: items_count
      }
      respond_to do |format|
        format.json do
          render(status: :ok, json: props)
        end
      end
    end

    def all_fields
      fields = Field.unscoped.all.map { |f| presenterify_field(f) }
      props = {
        fields: fields
      }
      respond_to do |format|
        format.json do
          render(status: :ok, json: props)
        end
      end
    end

    def new_react

      if Field.unscoped.where(id: params[:field][:id]).first
        respond_to do |format|
          format.json do
            render(status: :ok, json: {result: 'field-exists-already'})
          end
        end
        return
      end

      field = Field.new
      field.id = params[:field][:id]
      field.data = params[:field][:data].to_h
      field.position = 0
      field.dynamic = true
      field.active = params[:field][:active]
      field.save!
      respond_to do |format|
        format.json do
          render(status: :ok, json: {result: 'field-saved'})
        end
      end

    end

    def update_react
      field_id = params[:field][:id]
      field = Field.unscoped.find(field_id)
      field.data = params[:field][:data].to_h
      field.position = params[:field][:position]
      field.active = params[:field][:active]
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

    def presenterify_field(field)
      {
        id: field.id,
        active: field.active,
        position: field.position,
        data: field.data,
        dynamic: field.dynamic
      }
    end

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
