require 'json'
require 'sinatra'
require 'pstore'

class App < Sinatra::Base
  get '/' do
    erb :index
  end

  get '/comments' do
    comments.to_json
  end

  post '/comments' do
    add_comment!(params)
    comments.to_json
  end

  delete '/comments' do
    delete_comment!(params)
    comments.to_json
  end

  def comments
    store.transaction do |s|
      s[:comments]
    end
  end

  def add_comment!(params)
    author, text = params[:author], params[:text]
    return false unless author && text
    store.transaction do |s|
      s[:comments] = s[:comments] || []
      s[:comments] << { id: SecureRandom.uuid, author: author, text: text }
    end
  end

  def delete_comment!(params)
    id = params[:id]
    return false unless id
    store.transaction do |s|
      s[:comments] = s[:comments].reject { |comment| comment[:id] == id }
    end
  end

  private

  def store
    @store ||= PStore.new('db/comments.pstore')
  end
end

App.run!
