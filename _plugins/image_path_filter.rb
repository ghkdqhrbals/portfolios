# _plugins/image_path_filter.rb
Jekyll::Hooks.register :documents, :pre_render do |document|
  document.content.gsub!(/!\[(.*?)\]\((.*?)\)/) do |match|
    alt_text = $1
    img_path = $2
    new_img_path = "/portfolios/assets/#{img_path}"
    "![#{alt_text}](#{new_img_path})"
  end
end