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
            sleep(time: 40, unit: 'SECONDS')
            sh 'npm stop'
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