---
layout: post
title: Creating a Raspberry Pi Media Hub
date: 2021-04-04 09:25
category:
author: Fraser Smith
tags: [Raspberry Pi, Plex, Plex Media Server, Plex Media Player, Manjaro, Arm, Arch Linux, Tidal]
summary: A simple update on how I re-purposed a Raspberry Pi 4 8GB into a fully featured media center / streaming hub with Tidal support.
---
<img src="/img/rpihifi.jpg" alt="Raspberry Pi 4" />
_I've had a Raspberry Pi 3 hooked up to my HiFi for several years providing audio streaming support for the various mobile devices in our home. While it has also served as a Plex media server using a 2TB USB drive, it has never been powerful enough to support video playback at reasonable quality. When I got a Raspberry Pi4 with 8GB RAM recently, I decided it was time for an upgrade._
<!--more-->

**The Goal:** To seamlessly replicate the existing Pi3 set-up as a Plex Media Server and Airplay. To add video and audio playback using the Pi4 as a media client.

**Stretch Goal:** To support HiFi quality Tidal music streaming locally. I.e. without using a mobile device streaming over Airplay.

**Hardware:** Raspberry Pi4 8GB, PiFi DAC+ 2.0 (This is a HiFi Berry clone), Argon NEO case, Rapoo K2800 Media Keyboard, Lexar S47 USB 256GB drive, Toshiba external 2TB drive.

**Software:** Manjaro ARM MATE Desktop Community edition, Plex Media Server, Plex Media Player, shairport-sync.

I'm not going to detail the process of installing the operating system as there are many tutorials online that cover that process. However, I will say that I opted to install and boot off a USB drive rather than a Micro SD card because Micro SD cards are notoriously prone to corruption after sudden power loss whereas USB booted systems seem more stable. The availablity of fast USB3 drives means that they are also significanly faster than the internal MicroSD card reader as well.

I opted for [Manjaro ARM edition](https://manjaro.org/download/#raspberry-pi-4) over Raspberry Pi OS, or Ubuntu because of the sheer scope of the Arch User Repository (The AUR). You could no doubt use PI OS or Ubuntu for this project, but you might have to get your hands dirty hunting around for 3rd party repositories or building from scratch. With the AUR, somebody has usually done the work for you and most apps have already been packaged for you. After flashing the Manjaro image to my USB drive on my main computer, I edited the `/boot/config.txt` file while it was still plugged into my laptop.

```
#enable sound
#dtparam=audio=on
# Enable HiFiberry DAC Standard/Pro
dtoverlay=hifiberry-dacplus
```
{: .language-bash}

The `dtparam` line is commented out to disable the internal Pi DAC and 3.5mm output because it's not very good. The `dtoverlay` line enables support for hifiberry-dacplus DAC. Mine is a third part clone, but it's compatible with the HiFi Berry so the settings work. This is about the only text editing that you have to do. The rest can be done within the MATE desktop on the Pi. Note, while editing the `boot/config.txt` file, you could also overclock your Pi from 1.5MHz to 2GHz, but seriously, for this application you don't need to and the Pi get's warm enough as it is while rendering audio or video. Plus, with the DAC hat installed, you don't have many cooling options.

