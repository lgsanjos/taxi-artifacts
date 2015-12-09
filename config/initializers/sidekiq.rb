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
password = properties['password']

#Sidekiq.configure_server do |config|
  #config.redis = { :host => "redis://#{host}:#{port}/#{db_num}", :namespace => namespace }
#end

Sidekiq.configure_server do |config|
  if (ENV['RACK_ENV'] == "production")
    config.redis = { url: "redis://:#{password}@#{host}:#{port}/#{db_num}"}
  else
    config.redis = { url: "redis://#{host}:#{port}/#{db_num}"}
  end
end

Sidekiq.configure_client do |config|
  if (ENV['RACK_ENV'] == "production")
    config.redis = { url: "redis://:#{password}@#{host}:#{port}/#{db_num}"}
  else
    config.redis = { url: "redis://#{host}:#{port}/#{db_num}"}
  end
end
