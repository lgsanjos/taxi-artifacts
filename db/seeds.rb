# ruby encoding: utf-8

p "creating user"
User.new(
  email: 'admin@taxifinder.com.br',
  username: 'admin',
  name: 'admin',
  phone: '44 99171453',
  password: 'ezmoney').tap do |u|
      u.generate_token
      u.save!
  end
