namespace :app do
  namespace :seed do

    def set_stupid_password_for(user)
      dba = DatabaseAuthentication.where(login: user.login).first
      dba.password = 'password'
      dba.password_confirmation = 'password'
      dba.save
    end

    desc 'Seed the app with data'
    task demo: :environment do
      puts '[START] Seeding the demo data'
      require 'factory_girl'
      require 'faker'

      Dir.glob("#{Rails.root}/factories/**/*factory.rb") { |f| require f }

      FactoryGirl.create(:authentication_system, name: 'DatabaseAuthentication')

      ip1 = FactoryGirl.create(:inventory_pool, name: 'General Reservation Desk')
      ip2 = FactoryGirl.create(:inventory_pool, name: 'Chemistry Lab')
      ip3 = FactoryGirl.create(:inventory_pool, name: 'Film Studio')

      # Some customers so that the database doesn't look so empty
      20.times do
        us = FactoryGirl.create(:user)
        us.access_rights.build(role: :customer, inventory_pool: ip1)
        us.access_rights.build(role: :customer, inventory_pool: ip2)
        us.access_rights.build(role: :customer, inventory_pool: ip3)
        us.save
      end

      # A normal user that people can use to log in with
      normal_user = FactoryGirl.create(:user,
                                       login: 'normal_user',
                                       firstname: 'Normalio',
                                       lastname: 'Normex')
      normal_user.access_rights.build(role: :customer, inventory_pool: ip1)
      normal_user.access_rights.build(role: :customer, inventory_pool: ip2)
      normal_user.access_rights.build(role: :customer, inventory_pool: ip3)
      normal_user.save
      set_stupid_password_for(normal_user)

      # An inventory manager
      inventory_manager = FactoryGirl.create(:user,
                                             login: 'inventory_manager',
                                             firstname: 'Inventory',
                                             lastname: 'Manager')
      inventory_manager.access_rights.build(role: :inventory_manager,
                                            inventory_pool: ip1)
      inventory_manager.access_rights.build(role: :inventory_manager,
                                            inventory_pool: ip2)
      inventory_manager.access_rights.build(role: :inventory_manager,
                                            inventory_pool: ip3)
      inventory_manager.save
      set_stupid_password_for(inventory_manager)

      # A lending manager
      lending_manager = FactoryGirl.create(:user,
                                           login: 'lending_manager',
                                           firstname: 'Lending',
                                           lastname: 'Manager')
      lending_manager.access_rights.build(role: :lending_manager,
                                          inventory_pool: ip1)
      lending_manager.access_rights.build(role: :lending_manager,
                                          inventory_pool: ip2)
      lending_manager.access_rights.build(role: :lending_manager,
                                          inventory_pool: ip3)
      lending_manager.save
      set_stupid_password_for(lending_manager)

      # A group manager
      group_manager = FactoryGirl.create(:user,
                                         login: 'group_manager',
                                         firstname: 'Group',
                                         lastname: 'Manager')
      group_manager.access_rights.build(role: :group_manager,
                                        inventory_pool: ip1)
      group_manager.access_rights.build(role: :group_manager,
                                        inventory_pool: ip2)
      group_manager.access_rights.build(role: :group_manager,
                                        inventory_pool: ip3)
      group_manager.save
      set_stupid_password_for(group_manager)

      # An admin
      admin_user = FactoryGirl.create(:user,
                                      login: 'admin',
                                      firstname: 'Admin',
                                      lastname: 'Admin')
      admin_user.access_rights.build(role: :admin)
      admin_user.save
      set_stupid_password_for(admin_user)

      # Categories
      head = FactoryGirl.create(:category, name: 'Headphones')
      speakers = FactoryGirl.create(:category, name: 'Speakers')
      chem = FactoryGirl.create(:category, name: 'Chemistry Equipment')
      film = FactoryGirl.create(:category, name: 'Film and Video')
      projectors = FactoryGirl.create(:category, name: 'Projectors')

      lighting = FactoryGirl.create(:category, name: 'Lighting')
      lighting.parents << film
      lighting.save

      cams = FactoryGirl.create(:category, name: 'Cameras')
      cams.parents << film
      cams.save

      tripods = FactoryGirl.create(:category, name: 'Tripods')
      tripods.parents << film
      tripods.save

      head.parents << film
      head.save

      # Models and items
      tt1 = FactoryGirl.create(:model,
                               product: 'Test tube, 20 cm',
                               manufacturer: 'ACME')
      tt1.categories << chem
      tt1.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: tt1.id)

      tt2 = FactoryGirl.create(:model,
                               product: 'Test tube, 10 cm',
                               manufacturer: 'ACME')
      tt2.categories << chem
      tt2.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: tt2.id)

      tt3 = FactoryGirl.create(:model,
                               product: 'Test tube, 5 cm',
                               manufacturer: 'ACME')
      tt3.categories << chem
      tt3.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: tt3.id)

      bb = FactoryGirl.create(:model,
                              product: 'Bunsen burner',
                              manufacturer: 'ACME')
      bb.categories << chem
      bb.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: bb.id)

      cob = FactoryGirl.create(:model,
                               product: 'Chalice of blood',
                               manufacturer: 'ACME')
      cob.categories << chem
      cob.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: cob.id)

      # Inventory that is exlusive to the chemistry guys
      10.times do
        [tt1, tt2, tt3, bb, cob].each do |model|
          FactoryGirl.create(:item, model: model, owner: ip2, inventory_pool: ip2)
        end
      end

      lc = FactoryGirl.create(:model,
                              product: 'Lighting case Arri Start-Up-Kit Fresnel',
                              manufacturer: 'Arri')
      lc.categories << lighting
      lc.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: lc.id)

      pb = FactoryGirl.create(
        :model,
        product: 'Battery-powered light Photon Beard Hyperlight 471',
        manufacturer: 'Photon Beard')
      pb.categories = [lighting, film]
      pb.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: pb.id)

      arri1 = FactoryGirl.create(:model,
                                 product: 'Arri Alexa PLUS DTE-SXS Super 35mm',
                                 manufacturer: 'Arri')
      arri1.categories = [cams, film]
      arri1.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: arri1.id)

      genelec = FactoryGirl.create(:model,
                                   product: 'Genelec 8020B',
                                   manufacturer: 'Genelec')
      genelec.categories << speakers
      genelec.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: genelec.id)

      sony = FactoryGirl.create(:model,
                                product: 'HDCAM Sony HDW-750PC',
                                manufacturer: 'Sony')
      sony.categories << cams
      sony.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: sony.id)

      pana = FactoryGirl.create(:model,
                                product: 'Panasonic HDC-HS300',
                                manufacturer: 'Panasonic')
      pana.categories << cams
      pana.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: pana.id)

      manfrotto = FactoryGirl.create(
        :model,
        product: 'Tripod Manfrotto Slide Leg Century A256SB',
        manufacturer: 'Manfrotto')
      manfrotto.categories << tripods
      manfrotto.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: manfrotto.id)

      acer = FactoryGirl.create(:model,
                                product: 'Acer H7531D Full-HD',
                                manufacturer: 'Acer')
      acer.categories << projectors
      acer.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: acer.id)

      sony_h = FactoryGirl.create(:model,
                                  product: 'Headphones Sony MDR-V500',
                                  manufacturer: 'Sony')
      sony_h.categories << head
      sony_h.save
      FactoryGirl.create(:image,
                         :with_thumbnail,
                         target_type: 'Model',
                         target_id: sony_h.id)

      # General pool and film guys share some equipment that might work for both
      10.times do
        [pb, genelec, sony, pana, manfrotto, acer, sony_h].each do |model|
          FactoryGirl.create(:item, model: model, owner: ip1, inventory_pool: ip1)
          FactoryGirl.create(:item, model: model, owner: ip3, inventory_pool: ip3)
        end
      end

      # Some items for those models
      10.times do
        [lc, arri1].each do |model|
          FactoryGirl.create(:item, model: model, owner: ip3, inventory_pool: ip3)
        end
      end

      ############################ PROCUREMENT ####################################

      factories_path = \
        "#{Rails.root}/engines/procurement/spec/factories/**/*factory.rb"
      Dir.glob(factories_path) { |f| require f }
      FactoryGirl.create(:procurement_budget_period)
      procurement_admin = FactoryGirl.create(:user,
                                             login: 'procurement_admin',
                                             firstname: 'Procurement',
                                             lastname: 'Admin')
      procurement_admin.access_rights.create(role: :customer, inventory_pool: ip1)
      FactoryGirl.create(:procurement_access, :admin, user: procurement_admin)
      set_stupid_password_for(procurement_admin)
      FactoryGirl.create(:procurement_access, :requester)
      FactoryGirl.create(:procurement_category, :with_templates)

      #############################################################################

      Leihs::Fields.create_fields

      puts '[END] Seeding the demo data'
    end
  end
end
