# Make relative Markdown image references stable with pretty permalinks.
module NormalizeImagePaths
  module_function

  def normalize(path)
    parts = []
    path.split('/').each do |part|
      next if part.empty? || part == '.'
      if part == '..'
        parts.pop
      else
        parts << part
      end
    end
    '/' + parts.join('/')
  end

  def relative_image?(source)
    !source.empty? && !source.start_with?('/', '//', '#', 'data:', 'http:', 'https:')
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  Dir.glob(File.join(site.dest, '**', '*.html')).each do |file|
    relative_file = file.delete_prefix(site.dest).tr('\\', '/')
    page_dir = if relative_file == '/index.html'
      '/'
    elsif relative_file.end_with?('/index.html')
      relative_file.delete_suffix('index.html')
    else
      "#{relative_file.delete_suffix('.html')}/"
    end
    html = File.read(file)
    updated = html.gsub(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/i) do
      prefix, source, suffix = Regexp.last_match.captures
      if NormalizeImagePaths.relative_image?(source)
        "#{prefix}#{NormalizeImagePaths.normalize(page_dir + source)}#{suffix}"
      else
        "#{prefix}#{source}#{suffix}"
      end
    end
    File.write(file, updated) if updated != html
  end
end
