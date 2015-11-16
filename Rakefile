require 'rake'
require 'rubygems'
require 'pathname'
require 'oj'
require 'active_record'

Dir["./config/initializers/**.rb",
    "./app/model/*.rb",
    "./app/services/*.rb",
    "./db/**.rb",
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


root = File.expand_path '..', __FILE__
include ActiveRecord::Tasks

DatabaseTasks.env = ENV['RACK_ENV'] || 'development'
DatabaseTasks.database_configuration = YAML.load(File.read(File.join(root, 'config/database.yml')))
DatabaseTasks.db_dir = File.join root, 'db'
DatabaseTasks.fixtures_path = File.join root, 'test/fixtures'
DatabaseTasks.migrations_paths = [File.join(root, 'db/migrate')]
DatabaseTasks.seed_loader = Seeder.new File.join root, 'db/seeds.rb'
DatabaseTasks.root = root
task :environment do
  ActiveRecord::Base.configurations = DatabaseTasks.database_configuration
  ActiveRecord::Base.establish_connection DatabaseTasks.env.to_sym
end
load 'active_record/railties/databases.rake'
if ENV['RACK_ENV'] != 'production'
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
end
task :default => :spec
