require 'i18n'

I18n.load_path += Dir[File.join(File.dirname(__FILE__), '../../locales', '*.yml').to_s]
I18n.enforce_available_locales = false
I18n.locale = 'pt-BR'
