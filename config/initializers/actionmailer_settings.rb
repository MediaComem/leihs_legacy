class ActionMailer::Base

  def self.smtp_settings
    default_settings = {
      :address => "localhost",
      :port => 25,
      :domain => "localhost",
      :enable_starttls_auto => false,
      :openssl_verify_mode => 'none'
    }

    # If you don't check for the existence of a settings table, you will break
    # Rails initialization and so e.g. rake db:migrate no longer works. So
    # having no settings table will break initialization of the Rake task that
    # creates the settings table in the first place (!), creating a chicken and
    # egg problem.
    #
    # Additionally, we have to check for existance of each setting because the settings
    # table will be changed by migrations along the way, so the setting we expect to be
    # there might not actually exist while we are running the migration.
    if ApplicationRecord.connection.tables.include?("settings")
      begin
        settings = {
          :address => Setting.smtp_address,
          :port => Setting.smtp_port,
          :domain => Setting.smtp_domain,
          :enable_starttls_auto => Setting.smtp_enable_starttls_auto,
          :openssl_verify_mode => Setting.smtp_openssl_verify_mode
        }
      rescue
        logger.info("Could not configure ActionMailer because the database doesn't seem to be in the right shape for it. Check the settings table.")
        settings = default_settings
      end

      # Catch NameError and uninitialized constant if these settings aren't defined
      begin
        if (Setting.smtp_username and Setting.smtp_password) and (!Setting.smtp_username.empty? and !Setting.smtp_password.empty?)
          auth_settings = {
            :user_name => Setting.smtp_username,
            :password => Setting.smtp_password
          }
          settings.merge!(auth_settings)
        end
      rescue
      end
    else
      settings = default_settings
    end
    return settings
  end

  def self.delivery_method
    begin
      delivery_method = Setting.mail_delivery_method.to_sym
      if delivery_method.empty?
        delivery_method = :test
      end
    rescue
      delivery_method = :smtp
    end
    return delivery_method
  end

end
