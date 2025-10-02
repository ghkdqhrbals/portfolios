require 'time'

module Jekyll
  class DocsPaginator < Generator
    safe false
    priority :low

    def generate(site)
      per_page = (site.config['recent_docs_per_page'] || 20).to_i
      return if per_page <= 0

      # Collect dated docs pages
      docs = site.pages.select do |p|
        p.path.start_with?('docs/') && p.data['date']
      end
      return if docs.empty?

      # Normalize and sort by date desc
      docs.sort_by! do |p|
        d = p.data['date']
        d.is_a?(Time) ? d : Time.parse(d.to_s) rescue Time.at(0)
      end
      docs.reverse!

      total_pages = (docs.size.to_f / per_page).ceil

      (1..total_pages).each do |page_num|
        page = if page_num == 1
          # existing index page
          site.pages.find { |pg| pg.url == '/' }
        else
          DocsPage.new(site, site.source, page_num)
        end
        next unless page

        slice = docs.slice((page_num - 1) * per_page, per_page) || []
        page.data['recent_docs'] = slice
        page.data['recent_docs_total_pages'] = total_pages
        page.data['recent_docs_current_page'] = page_num
        page.data['recent_docs_prev_page'] = (page_num > 1) ? (page_num == 2 ? '/' : "/page/#{page_num - 1}/") : nil
        page.data['recent_docs_next_page'] = (page_num < total_pages) ? "/page/#{page_num + 1}/" : nil
        page.data['is_recent_pagination'] = true
      end
    end
  end

  class DocsPage < Page
    def initialize(site, base, page_num)
      @site = site
      @base = base
      @dir  = "page/#{page_num}"
      @name = 'index.html'
      process(@name)
      read_yaml(File.join(base, '_layouts'), 'default.html')
      self.data['title'] = "Recent Posts (Page #{page_num})"
      self.data['layout'] = 'default'
      self.data['permalink'] = "/page/#{page_num}/"
      self.data['description'] = 'Recent technical notes'
    end
  end
end
