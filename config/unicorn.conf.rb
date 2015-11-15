APP_PATH = File.expand_path '.'

pid APP_PATH + "/alugator.pid" 
stderr_path APP_PATH + "/logs/alugator.stderr.log"
stdout_path APP_PATH + "/logs/alugator.stdout.log"
worker_processes 3
timeout 15
preload_app true
