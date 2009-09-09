require 'rubygems'
require 'sinatra'
Sinatra::Application.set(
  :run => false,
  :environment => :development
)
require 'app.rb'
run Sinatra::Application

