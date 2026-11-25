# Copy to deploy.local.psd1 and adjust. deploy.local.psd1 is not committed.
@{
  SshTarget = 'user@192.168.1.10'
  DevPath   = '/volume1/docker/energiefluss-dev'
  Docker    = '/usr/local/bin/docker'
  DevUrl    = 'http://192.168.1.10:8125'
}
