require 'active_record'
require 'yaml'

dbconfig = YAML::load(File.open('./config/database.yml'))
env = (ENV['RACK_ENV'] || 'development')
ActiveRecord::Base.establish_connection(dbconfig[env])
