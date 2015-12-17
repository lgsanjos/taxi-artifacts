require 'rake'
require 'rubygems'
require 'pathname'
require 'oj'
require 'standalone_migrations'

Dir["./config/initializers/**.rb",
    "./app/model/*.rb",
    "./app/services/*.rb",
    "./app/*.rb"].each { |file| require file }

Dir['app/tasks/*.rb'].each { |task| import task }

class Seeder
  def initialize(seed_file)
    @seed_file = seed_file
  end

  def load_seed
    raise "Seed file '#{@seed_file}' does not exist" unless File.file?(@seed_file)
    load @seed_file
  end
end


StandaloneMigrations::Tasks.load_tasks

root = File.expand_path '..', __FILE__

if ENV['RACK_ENV'] != 'production'
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
end
task :default => :spec
