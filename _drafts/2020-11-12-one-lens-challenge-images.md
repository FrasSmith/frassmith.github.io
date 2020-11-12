---
layout: post
title: Images from the One Lens Challenge
date: 2020-11-12 08:09
category:
author: Fraser Smith
tags: [OneLensChallenge, Canon, EOS-M5, 7Artisans, Manual Lens]
summary: I have decided to attempt the Single Lens Challenge for the month of November, 2020. This post is a gallery of images shot so far.
images:
 -  olc1.jpg
 -  olc2.jpg
---
<img src="/img/lens.jpg" alt="EOS-M5 7Artisans 35mm f1.2" />
_A gallery of images from my One Lens Challenge in November 2020. All images taken with Canon EOS-M5 with the 7Artisans 35mm f1.2 lens._
<!--more-->
<div>
    {% for img in page.images %}
    <a href="/img/one-lens/{{ img }}" data-fancybox="gallery" >
        <img class="galpic" src="/img/one-lens/{{ img }}" />
    </a>
    {% endfor %}
</div>
<div style="clear:both;"></div>

{% include image-gallery.html folder="/img/one-lens" %}
