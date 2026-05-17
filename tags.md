---
layout: default
title: Tags
nav_order: 99
description: "기술 태그별 글 목록"
permalink: /tags/
toc_sidebar: false
---

{% assign tagged_pages = site.pages | where_exp: "p", "p.path contains 'docs/' and p.tags" %}
{% assign tag_string = "" %}
{% for p in tagged_pages %}
  {% for tag in p.tags %}
    {% assign tag_string = tag_string | append: tag | append: "|" %}
  {% endfor %}
{% endfor %}
{% assign tags = tag_string | split: "|" | uniq | sort %}

<div class="tag-index">
  <div class="tag-index__cloud" aria-label="Tag index">
    {% for tag in tags %}
      {% if tag != "" %}
        {% assign posts_for_tag = tagged_pages | where_exp: "p", "p.tags contains tag" %}
        <a href="#{{ tag }}">{{ tag }} <span>{{ posts_for_tag.size }}</span></a>
      {% endif %}
    {% endfor %}
  </div>

  {% for tag in tags %}
    {% if tag != "" %}
      <section id="{{ tag }}" class="tag-index__section">
        {% assign posts_for_tag = tagged_pages | where_exp: "p", "p.tags contains tag" | sort: "date" | reverse %}
        <h2>{{ tag }} <span>{{ posts_for_tag.size }}</span></h2>
        <ul class="tag-index__list">
          {% for p in posts_for_tag %}
            <li>
              {% if p.date %}
                <time datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: "%Y-%m-%d" }}</time>
              {% endif %}
              <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
            </li>
          {% endfor %}
        </ul>
      </section>
    {% endif %}
  {% endfor %}
</div>
