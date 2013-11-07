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
fab dev restart_services
fab dev manage:createsuperuser

# Log in to your VM
sudo vim /etc/nginx/sites-enabled/aklogbook
    # Edit the server names to be: 
        # *.enketo enketo;
        # localhost _;
sudo service nginx reload
```

## DNS Madness

Enketo uses subdomains extensively to identify unique ids of forms. Unfortunately, 
this means that local `123xyz.localhost` doesn't resolve properly. Plus you need to
differentiate enketo vs. formhub virtual hosts ...

Edit the `/etc/hosts` file on both the host and virtual server.

* On Windows hosts edit as adminstrator `C:\Windows\System32\drivers\etc\hosts`

## Requirements
* node (with npm)
* ruby (then `gem install compass`)

## NPM

    npm install -g yo grunt-cli bower karma generator-angular
    cd <code>
    npm install # install local node packages
    bower install
    cd app\bower_components\leaftlet
    npm install -g jake
    npm install
