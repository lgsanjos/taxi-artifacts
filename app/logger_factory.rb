class LoggerFactory
  @level_config = {
    'development' => Logger::DEBUG,
    'test' => Logger::WARN,
    'production' => Logger::INFO
  }

  def self.create
    log = Logger.new(STDOUT)
    log.level = @level_config[ENV['RACK_ENV']] if ENV['RACK_ENV']
    log
  end
end
