require 'sidekiq'
Dir["./config/initializers/**.rb", "./app/**.rb", "./app/workers/**.rb", "./app/model/**.rb", "./app/services/**.rb"].each {|file| require file}
