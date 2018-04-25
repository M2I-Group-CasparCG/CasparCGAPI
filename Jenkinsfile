pipeline {
  agent any
  stages {
    stage('npm-install') {
      steps {
        sh 'npm install'
      }
    }
    stage('npm-test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Api Tests') {
      parallel {
        stage('npm run') {
          steps {
            sh 'npm run dev'
          }
        }
        stage('newman tests') {
          steps {
            sleep 10
            sh 'newman run ./utilities/API/CasparCGAPI.postman_collection.json -e ./utilities/API/CasparCGAPI.postman_environment.json'
            sh 'pkill node'
          }
        }
      }
    }
    stage('Sonar-Scan') {
      steps {
        sh '/etc/sonar-scanner-3.1.0.1141-linux/bin/sonar-scanner -Dproject.settings=../CasparCGAPI_skg_master_sonar-project.properties'
      }
    }
  }
}