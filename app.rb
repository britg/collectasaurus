require 'rubygems'
require 'sprockets'
require 'compass' #must be loaded before sinatra
require 'sinatra'
require 'haml'    #must be loaded after sinatra

# set sinatra's variables
set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"

configure do
  # configure compass
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = File.join(Sinatra::Application.views, 'stylesheets')
    config.output_style = :compact
  end
end

# at a minimum, the main sass file must reside within the ./views directory. here, we create a ./views/stylesheets directory where all of the sass files can safely reside.
get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :"stylesheets/#{params[:name]}", :sass => Compass.sass_engine_options
end

get '/scripts/app.js' do
  content_type 'application/x-javascript', :charset => 'utf-8'
  secretary = Sprockets::Secretary.new(
    :asset_root   => "public",
    :load_path => ["public"],
    :source_files => ["public/lib/jquery-1.3.2.js", "public/lib/*.js", "public/base.js"]
  )

  # Generate a Sprockets::Concatenation object from the source files
  secretary.concatenation.to_s
end

get '/' do
  haml :index
end

get '/templates' do
  html = haml :templates
  callback = params[:callback];
  callback << '("' << html.gsub('"', '\"').gsub(/[\s]+/, "\s") << '");'
end
