require 'geocoder'
require './app/logger_factory'

logger = LoggerFactory.create

logger.info "[geocoder] using GOOGLE"

Geocoder.configure(
  :cache => {}, #TODO using simple hash for now, switch to Redis when possible :)
  :timeout => 5,
  :lookup => :google,
  :api_key => "AIzaSyAU6lgWN3JnMJfgmfHIY0WsKaE76RmQOy8",
  :units => :km
)
