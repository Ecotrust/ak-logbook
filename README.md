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

Edit the `/etc/hosts` file on both the host and virtual server to point 'enketo' and your version of '123xyz.enketo' to localhost.
You will also need to add an entry for '123xyz-0.enketo' and point it at localhost for editing forms to work.

* On Windows hosts edit as adminstrator `C:\Windows\System32\drivers\etc\hosts`

## Spatial Data
For AWC Nominations, you will need the shapefiles for ADFG regions and quads. 
Ecotrusters can find this data in the shared project folder: gis/projects/projects2013/AKLogbook/spatial_data/
Copy all of the files to formhub/logbook/data/

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

## Other URLS - Formhub, Enketo, and OpenRosa
If  you want to allow enketo to work with other formhub urls, here’s how you would configure it:
 
// in enketo/Code_Igniter/application/config/enketo.php
 
$config['openrosa_domains_allowed'] = array(
        //array('url' => '(www\.|dev\.)?formhub\.org\/?(martijnr|formhub_u)?', 'api_token' => 'abc123'),
-    array('url' => 'localhost', 'api_token' => 'abc123'),
    array('url' => 'aklogbook.ecotrust.org', 'api_token' => 'abc123'),
+    array('url' => 'formhub.aklogbook.ecotrust.org', 'api_token' => 'abc123'),
);