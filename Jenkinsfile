pipeline {
  agent any
  stages {
    stage('sonar-scan') {
      steps {
        sh '/etc/sonar-scanner-3.1.0.1141-linux/bin/sonar-scanner -Dproject.settings=/etc/sonar-scanner-3.1.0.1141-linux/casparCGAPI.properties'
      }
    }
    stage('npm-install') {
      steps {
        sh 'npm install'
      }
    }
  }
}