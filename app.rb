require 'json'
require 'sinatra'
require 'pstore'

class App < Sinatra::Base
  get '/' do
    erb :index
  end

  get '/comments.json' do
    comments = store.transaction do |s|
      s[:comments]
    end
    comments.to_json
  end

  post '/comments.json' do
    author, text = params[:author], params[:text]
    halt 422 unless author && text
    comments = store.transaction do |s|
      s[:comments] << { author: author, text: text }
      s[:comments]
    end
    comments.to_json
  end

  def store
    @store ||= PStore.new('db/comments.pstore')
  end
end

App.run!
