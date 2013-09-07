KEY_FILENAME = 'C:/Users/mperry/.vagrant.d/insecure_private_key'

AWS_KEY_FILENAME_STAGE = ['E:/projects/murdock/aws_keys/landownertools.pem']
AWS_PUBLIC_DNS_STAGE = ['ubuntu@stage.forestplanner.ecotrust.org']
AWS_SITENAME_STAGE = 'stage.forestplanner.ecotrust.org'
AWS_VARS_STAGE = {
    'num_cpus': 1,
    'shmmax': '983040000',  # 1/2 system memory, 1875 MB
    'postgres_shared_buffers': '469MB'  # 1/4 system memory
}

AWS_KEY_FILENAME_PROD = ['E:/projects/murdock/aws_keys/landownertools.pem']
#AWS_PUBLIC_DNS_PROD = ['ubuntu@54.214.30.97']
AWS_SITENAME_PROD = 'forestplanner.ecotrust.org'
AWS_VARS_PROD = {
    'num_cpus': 8,
    'shmmax': '268435456',  # TODO 1/2 system memory
    'postgres_shared_buffers': '128MB'  # TODO 1/4 system memory
}