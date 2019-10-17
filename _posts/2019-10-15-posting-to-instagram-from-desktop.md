---
layout: post
title: Posting to Instagram from the Desktop
subtitle: A short "how to".
date: 2019-10-15 22:08
category:
author: FrasSmith
tags: [instagram, photography, howto, tips, chrome]
summary: A simple way to upload to instagram from computers
---
One of the biggest frustrations for photographers when using [Instagram](https://instagram.com) is its mobile only ethos. For any photographer, uploading images to Instagram can be a chore as a typical workflow would be to transfer files from camera to computer, process files, export to jpeg and then, find some way to transfer the jpeg files onto a phone to upload to Instagram. It's almost as if Instagram doesn't really want serious photographers on its platform.
<!--more-->
There are a few tutorials online that outline various methods to work around this limitation. A common solution is to install some form of Android emulator or VM and then install the Instagram app there. This is over complicated and a huge resource drain for such a single use requirement.

The method described here is much simpler and uses an app, [Google Chrome](https://chrome.google.com), that you probably already have installed on your computer.

Most users will be familiar with the Instagram app on iPhone or Android devices. However, what many don't realise is that the app is not mandatory. You can use the Instagram web site on any mobile browser too. The site automatically detects that it's running in a mobile browser and includes the toolbar, including the upload button.

<img src="/assets/instamenu.jpg" style="width: 50%;" />

Wouldn't it be great if you could make the Instagram site on your desktop browser think that it's running on a mobile? Well, you can. Every browser sends a unique identifier to each website that it accesses, describing the platform that it's running on. This identifier, called the User-Agent, is what the site uses to decide whether it's responding to a mobile or a computer. There are extensions available for most popular desktop browsers that will allow you to manually set the User-Agent string to any value you want, allowing your desktop browser to identify as a mobile device if you wish.

For Chrome, one such extension is [User-Agent Switcher for Chrome](https://chrome.google.com/webstore/detail/user-agent-switcher-for-c/djflhoibgkdhkhhcedjiklpkjnoahfmg). Install this extension and you'll be able to configure it to use a User-Agent string for a mobile device whenever you access Instagram. Instagram will then serve up its mobile site complete with toolbar and function exactly as if its running on a mobile device. Quick, simple and no need to emulate anything.

<img src="/assets/desktop.png" style="width: 50%;" />

