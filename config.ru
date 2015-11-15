# config.ru
require 'sidekiq'

Sidekiq.configure_client do |config|
  config.redis = { :size => 1 }
end

ENV['geocoder-provider'] = 'google'

require './app/api'
require './app/web'

require 'sidekiq/web'
run Sidekiq::Web

run Rack::URLMap.new(
  '/api' => TaxiApp::API.new,
  '/sidekiq' => Sidekiq::Web
)

