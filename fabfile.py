from fabric.api import *

vars = {
    'app_dir': '/usr/local/apps/aklogbook',
    'formhub': '/usr/local/apps/formhub',
    'venv': '/usr/local/venv/aklogbook',
    'sitename': 'localhost:8080'
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
    vars['sitename'] = AWS_SITENAME_PROD
    return servers


def _install_requirements():
    run('cd %(app_dir)s && %(venv)s/bin/pip install --upgrade setuptools && %(venv)s/bin/pip install -r ../formhub/requirements.pip' % vars)


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


def init():
    """ Initialize the forest planner application """
    _install_requirements()
    _install_django()
    #_install_starspan()
    #_recache()
    #restart_services()


def restart_services():
    run('sudo service mongodb restart')
    run('sudo service uwsgi restart')
    run('sudo service nginx restart')
    #run('sudo supervisorctl restart all')
    run('sleep 2 && sudo supervisorctl status')


def runserver():
    """ Run the django dev server on port 8000 """
    run('cd %(formhub)s && %(venv)s/bin/python manage.py runserver 0.0.0.0:8080' % vars)


def update():
    """ Sync with master git repo """
    run('cd %(app_dir)s && git fetch && git merge origin/master' % vars)


def _install_starspan():
    run('mkdir -p ~/src && cd ~/src && \
        if [ ! -d "starspan" ]; then git clone git://github.com/Ecotrust/starspan.git; fi && \
        cd starspan && \
        if [ ! `which starspan` ]; then ./configure && make && sudo make install; fi')


def deploy():
    """
    Deploy to a staging/production environment
    """
    for s in env.hosts:
        if 'vagrant' in s:
            raise Exception("You can't deploy() to local dev, just use `init restart_services`")
    maintenance("on")
    update()
    init()
    restart_services()
    maintenance("off")


def maintenance(status):
    """
    turn maintenance mode on or off
        fab dev maintenance:on
        fab dev maintenance:off
    """
    if status == "on":
        run("touch /tmp/.maintenance_mode")
    else:
        run("rm /tmp/.maintenance_mode")


def provision():
    """
    Run puppet on a staging/production environment
    """
    stage = False
    for s in env.hosts:
        if 'vagrant' in s:
            raise Exception("You can't provision() on local dev, just vagrant up/provision")
        if 'stage' in s:
            stage = True

    maintenance("on")
    update()

    # see lot.pp for defaults
    if stage:
        num_cpus = AWS_VARS_STAGE.get("num_cpus", 1)
        postgres_shared_buffers = AWS_VARS_STAGE.get("postgres_shared_buffers", "48MB")
        shmmax = AWS_VARS_STAGE.get("shmmax", 67108864)
    else:  # assume prod
        num_cpus = AWS_VARS_PROD.get("num_cpus", 1)
        postgres_shared_buffers = AWS_VARS_PROD.get("postgres_shared_buffers", "48MB")
        shmmax = AWS_VARS_PROD.get("shmmax", 67108864)

    run("""sudo \
        facter_user=ubuntu \
        facter_group=ubuntu \
        facter_url_base=http://%s \
        facter_num_cpus=%s \
        facter_postgres_shared_buffers=%s \
        facter_shmmax=%s \
        facter_pgsql_base=/var/lib/postgresql/ puppet apply \
        --templatedir=/usr/local/apps/land_owner_tools/scripts/puppet/manifests/files \
        --modulepath=/usr/local/apps/land_owner_tools/scripts/puppet/modules \
        /usr/local/apps/land_owner_tools/scripts/puppet/manifests/lot.pp
        """ % (env.host,
               num_cpus,
               postgres_shared_buffers,
               shmmax
               )
        )

    restart_services()
    status()
