pipeline {
  agent any
  stages {
    stage('Install appli') {
      parallel {
        stage('Install appli') {
          steps {
            sh 'npm install'
          }
        }
        stage('git pull') {
          steps {
            sh 'git pull'
          }
        }
      }
    }
    stage('Test appli') {
      steps {
        sh 'npm test'
      }
    }
    stage('Launch appli') {
      parallel {
        stage('Npm stop') {
          steps {
            sleep(time: 2, unit: 'MINUTES')
            sh 'pkill npm'
          }
        }
        stage('Start appli') {
          steps {
            sh 'npm start run'
          }
        }
      }
    }
  }
}