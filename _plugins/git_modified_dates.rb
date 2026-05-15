require 'time'
require 'shellwords'

module Jekyll
  class GitModifiedDates < Generator
    safe false
    priority :highest

    def generate(site)
      site.pages.each do |page|
        next unless page.path.start_with?('docs/')

        front_matter_date = parse_date(page.data['date'])
        git_date = git_last_modified_date(site.source, page.path)
        display_date = front_matter_date || git_date

        next unless display_date

        page.data['git_updated_date'] = git_date.strftime('%Y-%m-%d') if git_date
        page.data['recent_display_date'] = display_date.strftime('%Y-%m-%d')
        page.data['recent_sort_date'] = display_date.strftime('%Y-%m-%d')
      end
    end

    private

    def parse_date(value)
      return value if value.is_a?(Time)
      return value.to_time if value.respond_to?(:to_time)
      return nil if value.nil? || value.to_s.strip.empty?

      Time.parse(value.to_s)
    rescue ArgumentError
      nil
    end

    def git_last_modified_date(source, path)
      output = `git -C #{Shellwords.escape(source)} log -1 --format=%cs -- #{Shellwords.escape(path)} 2>/dev/null`
      return nil unless $?.success?

      value = output.strip
      return nil if value.empty?

      Time.parse(value)
    rescue ArgumentError
      nil
    end
  end
end
