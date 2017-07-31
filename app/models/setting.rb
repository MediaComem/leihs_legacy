class Setting < ActiveRecord::Base
  audited

  validates_presence_of :local_currency_string,
                        :email_signature,
                        :default_email
  validates_presence_of :disable_borrow_section_message,
                        if: :disable_borrow_section?
  validates_presence_of :disable_manage_section_message,
                        if: :disable_manage_section?

  # validates_numericality_of :smtp_port, greater_than: 0
  # FIXME migration not running
  # validates_numericality_of :timeout_minutes, greater_than: 0

  validates_format_of :default_email,
                      with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i

  def self.method_missing(name, *_args, &_block)
    # TODO: replace class var with class instance var
    # rubocop:disable Style/ClassVars
    @@singleton ||= first # fetch the singleton from the database
    @@singleton.try :send, name
    # rubocop:enable Style/ClassVars
  end

  before_create do
    raise 'Setting is a singleton' if Setting.count > 0
  end

  after_save do
    # TODO: replace class var with class instance var
    # rubocop:disable Style/ClassVars
    @@singleton = nil
    # rubocop:enable Style/ClassVars
    begin
      # Only reading from the initializers is not enough, they are only read during
      # server start, making changes of the time zone during runtime impossible.
      # Check for existence of time_zone first,
      # in case the migration for time_zone has not run yet
      if self.time_zone_changed?
        Rails.configuration.time_zone = self.time_zone
        Time.zone_default = ActiveSupport::TimeZone.new(self.time_zone)
      end
    rescue
      logger.info 'Timezone setting could not be loaded. Did the migrations run?'
    end
  end

  def label_for_audits
    'Settings'
  end

end
