---
layout: page
title: Microbiome lounge
tagline: 
---
{% include JB/setup %}

<p>I am a Bioinformatics Scientist - currently a <a href="http://www.nrc-cnrc.gc.ca/eng/people/tremblay_julien_21216.html">Research Officer at the National Research Council Canada</a>. My interests are in microbiome genomics R&D and in
    developing end-to-end bioinformatics pipelines geared for environmental genomics data</p>

  <p><a href='linkedin.com/in/julien-tremblay-32b88835'><img src='images/linkedin.png' alt='linkedin' width='42' height='42'></a>
    <a href='https://scholar.google.ca/citations?user=sbA3Bh8AAAAJ&hl=en&oi=ao'><img src='images/gscholar.png' alt='gscholar' width='42' height='42'></a>
    <a href='https://twitter.com/julio_514'><img src='images/twitter.png' alt='twitter' width='42' height='42'></a>
    <!--<a href='www.environmentalgenomics.com'><img src='images/wordpress.png' alt='twitter' width='42' height='42'></a>-->
    <a href='https://github.com/jtremblay'><img src='images/github.png' alt='github' width='120' height='42'></a>
    <a href='https://bitbucket.org/jtremblay514/'><img src='images/bitbucket_icon.png' alt='bbucket' width='42' height='42'></a>
    <a href='https://hub.docker.com/u/julio514'><img src='images/dockerhub.png' alt='github' width='42' height='42'></a>
    <a href='https://jtremblay.github.io/amplicontagger.html'><img src='images/amplicontagger_logo.png' alt='amplicontagger' width='177' height='36'></a>
  </p>


    
## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>



