pipeline {
  agent any
  stages {
    stage('npm install') {
      steps {
        sh 'npm install'
      }
    }
    stage('npm test') {
      steps {
        sh 'npm test'
      }
    }
    stage('API test') {
      parallel {
        stage('npm run dev') {
          steps {
            sh 'npm run run_dev'
          }
        }
        stage('newman run') {
          steps {
            sleep 10
            sh 'newman run utilities/API/CasparCG\\ api.postman_collection.json'
            sh 'pkill node'
          }
        }
      }
    }
    stage('sonarQube') {
      steps {
        sh '/etc/sonar-scanner-3.1.0.1141-linux/bin/sonar-scanner -Dproject.settings=../CasparCGAPI_master_sonar-project.properties'
      }
    }
  }
}