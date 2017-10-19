![nwMAME Screenshot](https://ozguncagri.github.io/nwMAME/nwMAME_screenshot.png)

# What is nwMAME?

nwMAME is multi-platform (Windows, Linux, OS X) MAME front-end which uses power of **Web**. It's built top of **NW.JS** with **HTML5**, **JavaScript**, **CSS3** and using several technologies like **Node.JS**, **AngularJS**, **jQuery**, **Semantic UI** and ect...

# Why nwMAME?

As an OS X user, I highly influenced on [OpenEmu](http://openemu.org) project when I starting nwMAME project because OpenEmu wasn't enough to manage MAME library as I expected and using MAME in OpenEmu with giving up detailed MAME settings was driving me crazy! That's why I decided to make my own MAME front-end for fun.

# Does nwMAME compatible with dedicated MAME-PCs?

Technically speaking, it can run anywhere where **NW.JS** runs but; user interface is designed and aimed for keyboard-mouse use only and that's why it's not suitable for dedicated MAME-PCs. No one wants to use keyboard-mouse between their game sessions. That's why I'm planning any other project for dedicated MAME-PCs especially use it with MAME joysticks. (or; I can merge these two project into one project. Hmmm)

# Final Notes :

- nwMAME is not tested on retina screens yet!

Keep in touch for further updates!

---

# Installing nwMAME

First of all you have to download [NW.JS](http://nwjs.io) executable which is compatible with your operating system and then download **app.nw** file from `dist` folder and open it with **NW.JS** executable or you can put it next to NW.JS executable with **package.nw** name and just run NW.JS. NW.JS will automatically run **nwMAME** for you.

Optionally you can embed nwMAME into NW.JS according to [this article](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps).


# Using nwMAME (My Experience)

Well, starting instructions with "My Experience" idiom is not quite correct because I designed all application logic according to experience that I want. But I'm sure you're gonna love it ;)

## Step 1 : Creating Directories

Create one directory for your `MAME Library` and create this directories inside of your **MAME Library** directory;

- Bios
- Cheat
- Covers
- Device
- Emulator
- Roms
- Settings

Purpose of this folder structure is managing all types of files separately and easy to update.

## Step 2 : Downloading Required Files

> Before starting download; I suggest minimum 0.160 version and above with 64 Bit binaries for best MAME experience as I tested! Your MAME performance is not directly related with nwMAME. nwMAME is only front-end application for MAME!

- Download and extract MAME emulator inside of your `Emulator` directory from [Official MAME Development Team's Website](http://mamedev.org)

- Optionally you can download `cheat.7z` file (I don't know exact URL but you can easily find around the web) and put it inside of your `Cheat` directory (do not extract it)

- Download MAME Roms to your `Roms` directory

- Download BIOS files to your `Bios` directory

- Download Device files to your `Device` directory

### For Example;

If you want to play `Street Fighter EX2 Plus` you should download;

1. `sfex2p.zip` file to your `Roms` directory
2. `cpzn2.zip` file to your `Bios` directory
3. `qsound.zip` file to your `Device` directory

But, I suggest you to download all **Bios** and **Device** files (you can find packed versions with easy Google search) and put them inside of your `Bios` and `Device` directories then you can focus only for your Roms.

## Step 3 : Settings

Run nwMAME and click `Settings` button on the right bottom on nwMAME.

On **MAME** tab;

- Select `MAME Output Directory` as your `Settings` directory
- Select `MAME Executable Path` as your MAME emulator executable which you downloaded your `Emulator`directory before
- Select `ROM Files Directory` as your `Roms` directory
- Select `BIOS Files Directory` as your `Bios` directory
- Select `Device Files Directory` as your `Device` directory
- Optionally you can enable cheats and select `Cheats File` as your `cheats.7z` file which you downloaded your `Cheat`directory before
- Optionally you can also enable `Run games in window mode` option

On **Covers** tab;

- Select `Cover Directory` as your `Covers` directory
- Select `Cover Extension` depending your cover files extension

And you can also select `Cover Size` which one you desire.

**Expert** tab is reserved for expert MAME settings for later versions.

You can see execution errors, warnings and outputs on **Logs** tab.

**Debug** tab is used generally for development purposes.

## Step 4 : Cover Files

Managing cover files are easy. Just put your cover image into `Covers` directory and rename it with game's short name. You can see your game's short name when you select **List (No Covers)** as **Cover Size**. 

### For Example;

Do you want to add a cover to `Ultimate Mortal Kombat 3`? Just rename cover image as `umk3.jpg` and **Reload Application** from **Debug** tab in settings window or close and re-open nwMAME.

## Final Step : Update Game Library

Did you finished all steps successfully? Great, now you can update your game library on **MAME** tab. Updating game library process will take time, be patient until success message and save your settings!

# What about updates?

Do you want to update MAME? Just download new version of MAME and extract it into your `Emulator` directory.

Do you want to update `BIOS` or `Device` files? Download the file you want to update and replace it with the old one.

Do you want to update nwMAME? Just follow installation instructions!
