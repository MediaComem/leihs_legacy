class DatabaseAuthentication < ApplicationRecord
  audited

  attr_accessor :password

  validates_presence_of :login
  validates_presence_of :password, :password_confirmation
  validates_length_of :password, within: 4..40
  validates_confirmation_of :password
  validates_length_of :login, within: 3..255
  validates_uniqueness_of :login, case_sensitive: false

  before_validation :encrypt_password

  belongs_to :user

  # Authenticates a user by their login name and unencrypted password.
  # Returns the user or nil.
  def self.authenticate(login, password)
    u = find_by(['login = ?', login]) # need to get the salt
    u and u.authenticated?(password) ? u : nil
  end

  def authenticated?(password)
    crypted_password == encrypt(password)
  end

  def label_for_audits
    login
  end

  private

  def encrypt(password)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  def encrypt_password
    return if password == '_password_'
    if new_record?
      self.salt = Digest::SHA1.hexdigest("--#{Time.zone.now}--#{login}--")
    end
    self.crypted_password = encrypt(password)
  end
end
