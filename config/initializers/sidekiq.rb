require 'sidekiq'
require 'yaml'
require 'resolv-replace'
Dir["./config/initializers/**.rb", "./app/**.rb", "./app/workers/**.rb", "./app/model/**.rb", "./app/services/**.rb"].each {|file| require file}

config = YAML.load_file(File.join(File.dirname(File.expand_path(__FILE__)), '../redis.yml'))
env = ENV['RACK_ENV'].nil? ? 'development' : ENV['RACK_ENV']
properties = config[env]

host = properties['host']
port = properties['port']
#namespace = properties[:namespace]
db_num = properties['database']

#Sidekiq.configure_server do |config|
  #config.redis = { :host => "redis://#{host}:#{port}/#{db_num}", :namespace => namespace }
#end

Sidekiq.configure_server do |config|
  config.redis = { url: "redis://#{host}:#{port}/#{db_num}"}
end

Sidekiq.configure_client do |config|
  config.redis = { url: "redis://#{host}:#{port}/#{db_num}"}
end
