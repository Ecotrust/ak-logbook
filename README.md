Alaska Logbook
===============

Mobile data collection for Alaska fish surveys

Install
========
Requirements:
* Vagrant & VirtualBox
* git


```
git clone https://github.com/Ecotrust/ak-logbook.git
git clone https://github.com/Ecotrust/formhub.git
cd formhub
git submodule update --init
cd ..
git clone https://github.com/Ecotrust/enketo.git
cd enketo
git submodule update --init
cd ..

cd ak-logbook

# Make sure the host is not running anything on port 80 or 81!
vagrant up
fab dev init
```

## DNS Madness

Enketo uses subdomains extensively to identify unique ids of forms. Unfortunately, 
this means that local `123xyz.localhost` doesn't resolve properly. Plus you need to
differentiate enketo vs. formhub virtual hosts ...

Edit the `/etc/hosts` file on both the host and virtual server.

* On Windows hosts edit as adminstrator `C:\Windows\System32\drivers\etc\hosts`

TODO:
* submodules
* /etc/hosts stuff
* media copying
* instructions on important files to edit
