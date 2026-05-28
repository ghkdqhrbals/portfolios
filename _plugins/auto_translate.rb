module Jekyll
  Hooks.register :site, :after_init do |site|
    next if ENV["AUTO_TRANSLATE"].to_s.downcase == "false"

    script = File.join(site.source, "scripts", "auto_translate.mjs")
    next unless File.exist?(script)

    if ENV["OPENAI_API_KEY"].to_s.empty?
      Jekyll.logger.info "AutoTranslate:", "OPENAI_API_KEY not set; skipping."
      next
    end

    Jekyll.logger.info "AutoTranslate:", "generating English translations"
    ok = system(
      {
        "OPENAI_API_KEY" => ENV["OPENAI_API_KEY"].to_s,
        "OPENAI_TRANSLATION_MODEL" => ENV["OPENAI_TRANSLATION_MODEL"].to_s,
      },
      "node",
      script,
      "--write",
      chdir: site.source,
    )

    raise "AutoTranslate failed" unless ok
  end
end
