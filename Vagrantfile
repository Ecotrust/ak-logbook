# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.vm.forward_port 80, 8080
  config.vm.forward_port 81, 8081
  config.vm.forward_port 8000, 8000

  config.vm.share_folder "v-app", "/usr/local/apps/aklogbook", "./"
  config.vm.share_folder "v-enketo", "/usr/local/apps/enketo", "../enketo"
  config.vm.share_folder "v-formhub", "/usr/local/apps/formhub", "../formhub"

  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "puppet/manifests"
    puppet.manifest_file  = "aklogbook.pp"
    puppet.module_path = "puppet/modules"
    puppet.options = ["--templatedir","/vagrant/puppet/manifests/files","--verbose", "--debug"]
  end
end
