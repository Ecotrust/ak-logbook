from fabric.api import *
import os
import zipfile


vars = {
    'app_dir': '/usr/local/apps/aklogbook',
    'formhub': '/usr/local/apps/formhub',
    'enketo': '/usr/local/apps/enketo',
    'venv': '/usr/local/venv/aklogbook',
}

env.forward_agent = True
env.key_filename = '~/.vagrant.d/insecure_private_key'

from fab_vars import *

def dev():
    """ Use development server settings """
    servers = ['vagrant@127.0.0.1:2222']
    env.hosts = servers
    return servers

def prod():
    """ Use production server settings """
    env.key_filename = AWS_KEY_FILENAME_PROD
    servers = AWS_PUBLIC_DNS_PROD
    env.hosts = servers
    return servers


def _install_requirements():
    run('cd %(app_dir)s && %(venv)s/bin/pip install --upgrade setuptools \
        && %(venv)s/bin/pip install -r ../formhub/requirements.pip' % vars)


def _install_django():
    run('cd %(formhub)s && %(venv)s/bin/python manage.py syncdb --noinput && \
                           %(venv)s/bin/python manage.py collectstatic --noinput && \
                           %(venv)s/bin/python manage.py migrate --noinput' % vars)

def manage(command):
    """ Runs any manage.py command on the server """
    vars['command'] = command
    run('cd %(formhub)s && %(venv)s/bin/python manage.py %(command)s' % vars)
    del vars['command']


def import_data():
    """ Fetches and installs data fixtures (WARNING: 5+GB of data; hence not checking fixtures into the repo) """
    run('cd %(app_dir)s && %(venv)s/bin/python manage.py import_data' % vars)


def _install_mysql_fixtures():
    run('for i in /usr/local/apps/enketo/devinfo/database/*.sql; \
        do \
          mysql -u enketo --password=enketo -h localhost enketo < $i; \
        done')    


def init():
    _install_requirements()
    _install_django()
    _install_mysql_fixtures()


def restart_services():
    run('sudo service uwsgi restart')
    run('sudo service nginx restart')
    run('sudo service mongodb restart')
    run('sudo service php5-fpm restart')
    #run('sudo supervisorctl restart all')
    run('sudo supervisorctl reload || sudo service supervisor start')
    run('sleep 2 && sudo supervisorctl status')


def runserver():
    """ Run the django dev server on port 8000 """
    run('cd %(formhub)s && %(venv)s/bin/python manage.py runserver 0.0.0.0:8080' % vars)


def update():
    """ Sync with master git repos """
    run('cd %(app_dir)s && git fetch && git merge origin/master' % vars)
    run('cd %(formhub)s && git fetch && git merge origin/master' % vars)
    run('cd %(enketo)s && git stash && git fetch && git merge origin/master && git stash pop' % vars)


def _install_starspan():
    run('mkdir -p ~/src && cd ~/src && \
        if [ ! -d "starspan" ]; then git clone git://github.com/Ecotrust/starspan.git; fi && \
        cd starspan && \
        if [ ! `which starspan` ]; then ./configure && make && sudo make install; fi')


def _zipdir(path, outzip):
    zip = zipfile.ZipFile('dist.zip', 'w')
    for root, dirs, files in os.walk(path):
        for file in files:
            zip.write(os.path.join(root, file))
    zip.close()


def deploy():
    """
    Deploy to a staging/production environment
    """
    for s in env.hosts:
        if 'vagrant' in s:
            raise Exception("You can't deploy() to local dev, just use `init restart_services`")

    # Local: build grunt and zip it
    # try:
    #     os.remove('dist.zip')
    # except OSError:
    #     pass

    # local('cd angular_example && grunt build')
    # _zipdir("angular_example/dist", 'dist.zip')

    # Remote: transfer and unzip
    #put('dist.zip', vars['app_dir'])
    run('cd %(app_dir)s && unzip dist.zip' % vars)

    # Normal updates
    update()
    init()
    restart_services()
